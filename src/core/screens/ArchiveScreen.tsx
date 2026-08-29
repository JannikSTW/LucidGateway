import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Empty } from '../ui/basics'
import { Chip } from '../ui/inputs'
import { PageTitle, Screen, Scroll } from '../ui/layout'
import { EntryRow } from '../ui/EntryRow'
import { useEntries } from '../db/entries'
import { allCategories } from '../modules/registry'

/** Volltextsuche über Titel, beide Textblöcke, Stichworte und Marker. */
export function ArchiveScreen() {
  const [params, setParams] = useSearchParams()
  const filter = params.get('cat') ?? 'all'
  const [q, setQ] = useState('')
  const entries = useEntries()
  const cats = allCategories()

  const needle = q.trim().toLowerCase()
  const list = (entries ?? [])
    .filter((e) => filter === 'all' || e.cat === filter)
    .filter((e) => {
      if (!needle) return true
      const hay = [e.title, e.b1, e.b2, e.keywords ?? '', (e.tags ?? []).join(' ')].join(' ').toLowerCase()
      return hay.includes(needle)
    })

  const setFilter = (key: string) => {
    if (key === 'all') setParams({})
    else setParams({ cat: key })
  }

  return (
    <Screen zone="ld">
      <Scroll>
        <PageTitle eyebrow="Alle Einträge" title="Archiv" />
        <input
          className="search"
          type="text"
          value={q}
          placeholder="Suchen in Titel und Text …"
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ marginBottom: 'var(--sp-2)' }}>
          <Chip on={filter === 'all'} onClick={() => setFilter('all')}>
            Alle
          </Chip>
          {cats.map((c) => (
            <Chip key={c.key} on={filter === c.key} onClick={() => setFilter(c.key)}>
              {c.short}
            </Chip>
          ))}
        </div>
        {list.length ? (
          <Card rows>
            {list.map((e) => (
              <EntryRow key={e.id} entry={e} />
            ))}
          </Card>
        ) : (
          <Empty>{needle ? 'Nichts gefunden.' : 'Noch nichts archiviert.'}</Empty>
        )}
      </Scroll>
    </Screen>
  )
}
