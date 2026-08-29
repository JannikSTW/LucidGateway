import { Chip } from '../../../core/ui/inputs'
import { Text } from '../../../core/ui/basics'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { addPart, useParts } from '../db'

/**
 * „Wer hat sich gezeigt?“ — Chips aus dem Anteils-Register. Auch Unruhe oder
 * ein innerer Kritiker zählt.
 */
export function PartsExtra({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const picked = (value as string[] | undefined) ?? []
  const all = useParts()
  const dialog = useDialog()
  const toast = useToast()

  const names = [...new Set([...(all ?? []).map((p) => p.name), ...picked])]

  const create = async () => {
    const name = await dialog.text({ title: 'Neuer Anteil', placeholder: 'z. B. Der Kritiker' })
    if (!name) return
    if (!(await addPart(name))) toast('Gibt es schon')
    if (!picked.includes(name)) onChange([...picked, name])
  }

  return (
    <>
      <div>
        {names.map((n) => (
          <Chip
            key={n}
            on={picked.includes(n)}
            onClick={() => onChange(picked.includes(n) ? picked.filter((x) => x !== n) : [...picked, n])}
          >
            {n}
          </Chip>
        ))}
        <Chip onClick={() => void create()}>+ Neu</Chip>
      </div>
      <Text small style={{ marginTop: 'var(--sp-2)' }}>
        Anteile, Stimmen, Gestalten — auch Unruhe oder ein innerer Kritiker zählt.
      </Text>
    </>
  )
}
