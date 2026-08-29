import { useEffect, useRef, useState } from 'react'
import { loadImage, storeImage, deleteImage } from '../db/images'
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

export function ScanStrip({ ids, big = false }: { ids: number[]; big?: boolean }) {
  if (!ids.length) return null
  return (
    <div className="scan-thumbs">
      {ids.map((id) => (
        <ScanThumb key={id} id={id} big={big} />
      ))}
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

  const remove = async (id: number) => {
    await deleteImage(id)
    onChange(ids.filter((x) => x !== id))
  }

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
            <ScanThumb key={id} id={id} onRemove={() => void remove(id)} />
          ))}
        </div>
      )}
    </>
  )
}
