import { Chip } from '../../../core/ui/inputs'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { REGISTERS, REGISTER_KEYS, addRegItem, useRegItems } from '../db'
import type { RegisterKey } from '../types'

/**
 * Orte, Gestalten und Traumzeichen als Chips aus dem Register.
 * „+ Neu“ legt sofort an — das Register wächst also beim Schreiben mit.
 */
export function ElementsExtra({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const els = (value as Record<string, string[]> | undefined) ?? {}
  const items = useRegItems()
  const dialog = useDialog()
  const toast = useToast()

  const toggle = (reg: RegisterKey, name: string) => {
    const current = els[reg] ?? []
    const next = current.includes(name) ? current.filter((x) => x !== name) : [...current, name]
    onChange({ ...els, [reg]: next })
  }

  const create = async (reg: RegisterKey) => {
    const name = await dialog.text({
      title: `Neu in ${REGISTERS[reg].label}`,
      placeholder: 'Name',
    })
    if (!name) return
    const added = await addRegItem(reg, name)
    if (!added) toast('Gibt es schon')
    const current = els[reg] ?? []
    if (!current.includes(name)) onChange({ ...els, [reg]: [...current, name] })
  }

  return (
    <>
      {REGISTER_KEYS.map((reg) => {
        const names = (items ?? []).filter((i) => i.register === reg).map((i) => i.name)
        const picked = els[reg] ?? []
        // Auch Namen, die es im Register nicht (mehr) gibt, bleiben sichtbar.
        const all = [...new Set([...names, ...picked])]
        return (
          <div className="field" key={reg} style={{ marginBottom: 'var(--sp-6)' }}>
            <label>{REGISTERS[reg].label}</label>
            <div>
              {all.map((name) => (
                <Chip key={name} on={picked.includes(name)} onClick={() => toggle(reg, name)}>
                  {name}
                </Chip>
              ))}
              <Chip onClick={() => void create(reg)}>+ Neu</Chip>
            </div>
          </div>
        )
      })}
    </>
  )
}
