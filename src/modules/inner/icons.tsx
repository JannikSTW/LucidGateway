import { Ic } from '../../core/ui/icons'

/** Innenwelt: Gestalt mit Spirale. */
export const IconInner = () => (
  <Ic box={32}>
    <circle cx="16" cy="7.5" r="3" />
    <path d="M16 11.5v5.5" />
    <path d="M7.5 26c0-3.4 3.8-5.8 8.5-5.8s8.5 2.4 8.5 5.8" />
    <path d="M16 17 9.5 20.5M16 17l6.5 3.5" />
    <path d="M5 13.5c-1.6 2.4-1.6 5.4 0 7.8M27 13.5c1.6 2.4 1.6 5.4 0 7.8" />
  </Ic>
)

export const IconImagination = () => (
  <Ic>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
    <path d="M6.5 6.5 8.6 8.6M15.4 15.4l2.1 2.1M17.5 6.5l-2.1 2.1M8.6 15.4l-2.1 2.1" />
    <path d="M12 8.8a3.2 3.2 0 0 0 0 6.4" />
  </Ic>
)

export const IconBreath = () => (
  <Ic>
    <path d="M12 3.5v8" />
    <path d="M12 11.5c0 4.6-1.9 7.2-4.6 7.2S3 16.4 3 13.5s2.2-4.6 4.5-3.3" />
    <path d="M12 11.5c0 4.6 1.9 7.2 4.6 7.2S21 16.4 21 13.5s-2.2-4.6-4.5-3.3" />
  </Ic>
)

export const IconMeditation = () => (
  <Ic>
    <circle cx="12" cy="5" r="2.3" />
    <path d="M12 7.3v4.4" />
    <path d="M5.5 19.5c0-2.7 2.9-4.6 6.5-4.6s6.5 1.9 6.5 4.6" />
    <path d="M12 11.7 7 14.4M12 11.7l5 2.7" />
  </Ic>
)

/** Landkarte der Anteile. */
export const IconPsyche = () => (
  <Ic box={32}>
    <circle cx="16" cy="16" r="3" />
    <circle cx="7" cy="8" r="2.2" />
    <circle cx="25" cy="9" r="2.2" />
    <circle cx="6" cy="24" r="2.2" />
    <circle cx="24" cy="24" r="2.2" />
    <path d="M13.4 14.4 9 10M18.6 14.6 23 11M13.6 17.8 8 22.4M18.4 17.9 22.4 22.3" />
  </Ic>
)
