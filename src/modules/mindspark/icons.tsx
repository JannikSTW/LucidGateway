import { Ic } from '../../core/ui/icons'

/** MindSpark: Kopf mit Funke. */
export const IconMindSpark = () => (
  <Ic box={32}>
    <circle cx="16" cy="14" r="5.5" />
    <path d="M16 3v3M16 22v1.5M5 14H2M30 14h-3M8.2 6.2l2.1 2.1M21.7 19.7l2.1 2.1M23.8 6.2l-2.1 2.1M10.3 19.7l-2.1 2.1" />
    <path d="M3 28h26" />
  </Ic>
)

export const IconJournal = () => (
  <Ic box={32}>
    <path d="M7 5h14a3 3 0 0 1 3 3v19H10a3 3 0 0 1-3-3Z" />
    <path d="M12 11h7M12 16h7M12 21h4" />
  </Ic>
)

export const IconInbox = () => (
  <Ic box={32}>
    <path d="M4 17h6l2 4h8l2-4h6" />
    <path d="M7 6h18l4 11v7.5A2.5 2.5 0 0 1 26.5 27h-21A2.5 2.5 0 0 1 3 24.5V17Z" />
  </Ic>
)

export const IconTarget = () => (
  <Ic box={32}>
    <circle cx="16" cy="16" r="11" />
    <circle cx="16" cy="16" r="6" />
    <circle cx="16" cy="16" r="1.6" />
    <path d="M16 5V2M16 30v-3M5 16H2M30 16h-3" />
  </Ic>
)
