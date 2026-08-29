import { useEffect, useRef, useState } from 'react'
import { loadImage, storeImage } from '../db/images'
import { IconCamera } from './icons'
import { useToast } from './toast'

const MAX_SCANS = 4

function useObjectUrl(id: number): string | null {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    let revoke: string | null = null
    let alive = true
    loadImage(id).then((img) => {
      if (!alive || !img) return
      revoke = URL.createObjectURL(img.blob)
      setUrl(revoke)
    })
    return () => {
      alive = false
      if (revoke) URL.revokeObjectURL(revoke)
    }
  }, [id])
  return url
}

export function ScanThumb({ id, big = false, onRemove }: { id: number; big?: boolean; onRemove?: () => void }) {
  const url = useObjectUrl(id)
  return (
    <div className={`scan-thumb${big ? ' big' : ''}`}>
      {url && <img src={url} alt="Tagebuchseite" />}
      {onRemove && (
        <button type="button" className="x" onClick={onRemove} aria-label="Seite entfernen">
          ✕
        </button>
      )}
    </div>
  )
}

/** Zeigt die Seiten; ein Tipp vergrößert sie — Handschrift will lesbar sein. */
export function ScanStrip({ ids, big = false }: { ids: number[]; big?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  if (!ids.length) return null
  return (
    <>
      <div className="scan-thumbs">
        {ids.map((id) => (
          <div key={id} role="button" tabIndex={0} onClick={() => setOpen(id)} onKeyDown={(e) => e.key === 'Enter' && setOpen(id)}>
            <ScanThumb id={id} big={big} />
          </div>
        ))}
      </div>
      {open !== null && <Lightbox id={open} onClose={() => setOpen(null)} />}
    </>
  )
}

function Lightbox({ id, onClose }: { id: number; onClose: () => void }) {
  const url = useObjectUrl(id)
  return (
    <div className="lightbox" role="button" tabIndex={0} onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      {url && <img src={url} alt="Tagebuchseite" />}
    </div>
  )
}

/**
 * Papier ist gleichwertig: Der Scan ersetzt den Fließtext. Bilder werden beim
 * Aufnehmen komprimiert und liegen als Blob in der Datenbank.
 */
export function ScanPicker({ ids, onChange }: { ids: number[]; onChange: (ids: number[]) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const pick = () => {
    if (ids.length >= MAX_SCANS) {
      toast(`Maximal ${MAX_SCANS} Seiten`)
      return
    }
    input.current?.click()
  }

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    try {
      const room = MAX_SCANS - ids.length
      const chosen = Array.from(files).slice(0, room)
      const added: number[] = []
      for (const f of chosen) added.push(await storeImage(f))
      onChange([...ids, ...added])
      if (files.length > room) toast(`Nur ${room} Seiten passten noch dazu`)
    } catch {
      toast('Bild konnte nicht gelesen werden')
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  // Die Datei selbst bleibt vorerst liegen; verwaiste Bilder räumt der
  // Start auf. So geht beim Abbrechen einer Bearbeitung nichts verloren.
  const remove = (id: number) => onChange(ids.filter((x) => x !== id))

  return (
    <>
      <button type="button" className="dropzone" onClick={pick}>
        <IconCamera />
        <b>{busy ? 'Wird verkleinert …' : 'Seite fotografieren'}</b>
        <span className="sub" style={{ fontSize: '12.5px' }}>
          Deine Handschrift bleibt das Original.
        </span>
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={(e) => void onFiles(e.target.files)}
      />
      {ids.length > 0 && (
        <div className="scan-thumbs">
          {ids.map((id) => (
            <ScanThumb key={id} id={id} onRemove={() => remove(id)} />
          ))}
        </div>
      )}
    </>
  )
}
