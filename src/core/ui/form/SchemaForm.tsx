import { Field, TextInput, TextArea, ChipSingle, ChipMulti, Segmented, RangeRow } from '../inputs'
import type { FieldSpec, FieldValues } from './schema'

export function SchemaForm({
  fields,
  values,
  onChange,
}: {
  fields: FieldSpec[]
  values: FieldValues
  onChange: (k: string, v: unknown) => void
}) {
  return (
    <>
      {fields.map((f) => (
        <SchemaField key={f.k} field={f} value={values[f.k]} onChange={(v) => onChange(f.k, v)} />
      ))}
    </>
  )
}

function SchemaField({
  field: f,
  value,
  onChange,
}: {
  field: FieldSpec
  value: unknown
  onChange: (v: unknown) => void
}) {
  switch (f.t) {
    case 'text':
      return (
        <Field label={f.label} className={f.cls}>
          <TextInput value={(value as string) ?? ''} onChange={onChange} placeholder={f.ph} />
        </Field>
      )
    case 'number':
      return (
        <Field label={f.label} className={f.cls}>
          <TextInput
            type="number"
            inputMode="numeric"
            value={value === undefined || value === null ? '' : String(value)}
            onChange={(v) => onChange(v === '' ? null : Number(v))}
            placeholder={f.ph}
          />
        </Field>
      )
    case 'area':
      return (
        <Field label={f.label} className={f.cls}>
          <TextArea value={(value as string) ?? ''} onChange={onChange} placeholder={f.ph} rows={f.rows ?? 5} />
        </Field>
      )
    case 'single':
      return (
        <Field label={f.label} className={f.cls}>
          <ChipSingle options={f.opts} value={(value as string) ?? null} onChange={onChange} clearable />
        </Field>
      )
    case 'multi':
      return (
        <Field label={f.label} className={f.cls}>
          <ChipMulti options={f.opts} value={(value as string[]) ?? []} onChange={onChange} />
        </Field>
      )
    case 'scale':
      return (
        <Field label={f.label} className={f.cls}>
          <Segmented count={6} value={(value as number) ?? null} onChange={onChange} hints={f.hints} />
        </Field>
      )
    case 'range':
      return (
        <Field label={f.label} className={f.cls}>
          <RangeRow value={(value as number) ?? 5} onChange={onChange} left={f.left} right={f.right} />
        </Field>
      )
    case 'ba': {
      const v = (value as { b?: number; a?: number }) ?? {}
      return (
        <Field label={f.label} className={f.cls}>
          <div className="twoseg">
            <div>
              <Segmented
                count={5}
                from={1}
                value={v.b ?? null}
                onChange={(n) => onChange({ ...v, b: n })}
              />
              <div className="seg-hint" style={{ textAlign: 'center' }}>
                vorher
              </div>
            </div>
            <div>
              <Segmented
                count={5}
                from={1}
                value={v.a ?? null}
                onChange={(n) => onChange({ ...v, a: n })}
              />
              <div className="seg-hint" style={{ textAlign: 'center' }}>
                nachher
              </div>
            </div>
          </div>
        </Field>
      )
    }
    case 'custom':
      return (
        <Field label={f.label} className={f.cls}>
          {f.render(value, onChange)}
        </Field>
      )
  }
}
