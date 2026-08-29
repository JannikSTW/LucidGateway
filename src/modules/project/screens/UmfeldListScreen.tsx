import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Empty } from '../../../core/ui/basics'
import { Chip } from '../../../core/ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, Chevron } from '../../../core/ui/rows'
import { NGROUPS, degreeOf, nkind, useNetzwerk } from '../db'
import { NetzBadge } from '../components/NetzGlyph'
import type { NetzGroup } from '../types'

export function UmfeldListScreen() {
  const net = useNetzwerk()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'todo' | NetzGroup>('all')

  const list = (net?.items ?? [])
    .filter((n) => {
      if (filter === 'all') return true
      if (filter === 'todo') return !!n.next
      return nkind(n.kind).grp === filter
    })
    .sort((a, b) => degreeOf(net?.links ?? [], b.id!) - degreeOf(net?.links ?? [], a.id!))

  return (
    <Screen zone="mmm">
      <ScreenHeader eyebrow="Umfeld" title="Alle Elemente" back="/projekt/umfeld" />
      <Scroll tight>
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <Chip on={filter === 'all'} onClick={() => setFilter('all')}>
            Alle
          </Chip>
          {(Object.keys(NGROUPS) as NetzGroup[]).map((g) => (
            <Chip key={g} on={filter === g} onClick={() => setFilter(g)}>
              {NGROUPS[g].label}
            </Chip>
          ))}
          <Chip on={filter === 'todo'} onClick={() => setFilter('todo')}>
            Mit nächstem Schritt
          </Chip>
        </div>

        {list.length ? (
          <Card rows>
            {list.map((n) => (
              <Row
                key={n.id}
                icon={<NetzBadge kind={n.kind} />}
                bareIcon
                title={n.name}
                sub={`${nkind(n.kind).label}${n.next ? ` · ${n.next}` : ''}`}
                right={<Chevron />}
                onClick={() => navigate(`/projekt/umfeld/${n.id}`)}
              />
            ))}
          </Card>
        ) : (
          <Empty>Nichts in dieser Auswahl.</Empty>
        )}

        <Button onClick={() => navigate('/projekt/umfeld/neu')} style={{ marginTop: 'var(--sp-6)' }}>
          + Element anlegen
        </Button>
      </Scroll>
    </Screen>
  )
}
