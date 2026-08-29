import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Eigenes Dialogsystem im App-Stil. Browser-prompt()/confirm() sind bewusst
 * ausgeschlossen (FEATURES §6).
 */

interface TextOptions {
  title: string
  text?: string
  placeholder?: string
  value?: string
  okLabel?: string
  multiline?: boolean
}

interface ConfirmOptions {
  title: string
  text?: string
  okLabel?: string
}

interface DialogApi {
  text: (o: TextOptions) => Promise<string | null>
  confirm: (o: ConfirmOptions) => Promise<boolean>
}

const Ctx = createContext<DialogApi | null>(null)

export function useDialog(): DialogApi {
  const api = useContext(Ctx)
  if (!api) throw new Error('DialogProvider fehlt')
  return api
}

type State =
  | { kind: 'none' }
  | { kind: 'text'; opts: TextOptions; resolve: (v: string | null) => void }
  | { kind: 'confirm'; opts: ConfirmOptions; resolve: (v: boolean) => void }

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ kind: 'none' })
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const text = useCallback(
    (opts: TextOptions) =>
      new Promise<string | null>((resolve) => {
        setDraft(opts.value ?? '')
        setState({ kind: 'text', opts, resolve })
      }),
    [],
  )

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setState({ kind: 'confirm', opts, resolve })
      }),
    [],
  )

  useEffect(() => {
    if (state.kind === 'text') {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60)
      return () => window.clearTimeout(id)
    }
    return undefined
  }, [state.kind])

  const close = () => setState({ kind: 'none' })

  const cancel = () => {
    if (state.kind === 'text') state.resolve(null)
    if (state.kind === 'confirm') state.resolve(false)
    close()
  }

  const accept = () => {
    if (state.kind === 'text') {
      const v = draft.trim()
      state.resolve(v ? v : null)
    }
    if (state.kind === 'confirm') state.resolve(true)
    close()
  }

  return (
    <Ctx.Provider value={{ text, confirm }}>
      {children}
      {state.kind !== 'none' && (
        <div
          className="modal"
          onKeyDown={(e) => {
            if (e.key === 'Escape') cancel()
            if (e.key === 'Enter' && state.kind === 'text' && !state.opts.multiline) accept()
          }}
        >
          <div className="box" role="dialog" aria-modal="true">
            <h3>{state.opts.title}</h3>
            {state.opts.text && <p>{state.opts.text}</p>}
            {state.kind === 'text' &&
              (state.opts.multiline ? (
                <textarea
                  ref={(el) => {
                    inputRef.current = el
                  }}
                  rows={4}
                  value={draft}
                  placeholder={state.opts.placeholder}
                  onChange={(e) => setDraft(e.target.value)}
                />
              ) : (
                <input
                  ref={(el) => {
                    inputRef.current = el
                  }}
                  type="text"
                  value={draft}
                  placeholder={state.opts.placeholder}
                  onChange={(e) => setDraft(e.target.value)}
                />
              ))}
            <div className="acts">
              <button type="button" className="cancel" onClick={cancel}>
                Abbrechen
              </button>
              <button
                type="button"
                className={`ok${state.kind === 'confirm' ? ' danger' : ''}`}
                onClick={accept}
              >
                {state.opts.okLabel ?? (state.kind === 'confirm' ? 'Löschen' : 'Speichern')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}
