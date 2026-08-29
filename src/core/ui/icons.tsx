import type { ReactNode } from 'react'

/** Alle Icons zeichnen auf currentColor — Farbe kommt vom Umfeld. */
export function Ic({ children, box = 24 }: { children: ReactNode; box?: number }) {
  return (
    <svg className="ic" viewBox={`0 0 ${box} ${box}`} aria-hidden="true">
      {children}
    </svg>
  )
}

export const IconHome = () => (
  <Ic>
    <path d="M4 11 12 4l8 7" />
    <path d="M6 10v9h5v-5h2v5h5v-9" />
  </Ic>
)

export const IconArchive = () => (
  <Ic>
    <path d="M3 7.5 12 4l9 3.5-9 3.5Z" />
    <path d="M3 12l9 3.5L21 12" />
    <path d="M3 16.5 12 20l9-3.5" />
  </Ic>
)

export const IconPlus = () => (
  <Ic>
    <path d="M12 5v14M5 12h14" />
  </Ic>
)

export const IconGrid = () => (
  <Ic>
    <rect x="4" y="4" width="7" height="7" rx="1.6" />
    <rect x="13" y="4" width="7" height="7" rx="1.6" />
    <rect x="4" y="13" width="7" height="7" rx="1.6" />
    <rect x="13" y="13" width="7" height="7" rx="1.6" />
  </Ic>
)

export const IconSliders = () => (
  <Ic>
    <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h9M17 17h3" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="15" cy="17" r="2" />
  </Ic>
)

export const IconEye = () => (
  <Ic box={32}>
    <path d="M3.5 16S8 8 16 8s12.5 8 12.5 8-4.5 8-12.5 8S3.5 16 3.5 16Z" />
    <circle cx="16" cy="16" r="3.6" />
  </Ic>
)

export const IconArchiveBig = () => (
  <Ic box={32}>
    <path d="M4 10 16 5.5 28 10l-12 4.5Z" />
    <path d="M4 16l12 4.5L28 16" />
    <path d="M4 22l12 4.5L28 22" />
  </Ic>
)

export const IconPlusBig = () => (
  <Ic box={32}>
    <path d="M16 7v18M7 16h18" />
  </Ic>
)

export const IconCamera = () => (
  <Ic>
    <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.9l1.2-2h6.8l1.2 2h1.9A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5Z" />
    <circle cx="12" cy="13" r="3.6" />
  </Ic>
)

export const IconDownload = () => (
  <Ic>
    <path d="M12 4v11" />
    <path d="M8 11.5 12 15.5 16 11.5" />
    <path d="M4.5 19.5h15" />
  </Ic>
)

export const IconUpload = () => (
  <Ic>
    <path d="M12 15.5v-11" />
    <path d="M8 8.5 12 4.5 16 8.5" />
    <path d="M4.5 19.5h15" />
  </Ic>
)
