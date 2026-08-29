import { Ic } from '../../core/ui/icons'

/** Luzides Träumen: Mondsichel mit Sternen. */
export const IconDream = () => (
  <Ic box={32}>
    <path d="M22 6a9.5 9.5 0 1 1-9.9 15.4A11.5 11.5 0 0 0 22 6Z" />
    <circle cx="8.5" cy="8" r=".9" />
    <circle cx="6" cy="14" r=".8" />
    <circle cx="11" cy="4" r=".7" />
    <circle cx="6.5" cy="21" r=".8" />
    <circle cx="10" cy="26" r=".7" />
  </Ic>
)

/** OBE: Gestalt löst sich von der liegenden Gestalt. */
export const IconObe = () => (
  <Ic box={32}>
    <path d="M4 25h13" />
    <path d="M7 25v-2.5c0-1.4 1.1-2.5 2.5-2.5h4" />
    <circle cx="6" cy="18" r="2" />
    <path d="M22 28v-7.5c0-2.6 1.6-4.5 3.5-4.5" />
    <circle cx="21.5" cy="9" r="3" />
    <path d="M18 15.5c0-1.7 1.6-3 3.5-3s3.5 1.3 3.5 3" />
    <path d="M14 22c1.5-1.5 3-2.4 4.5-2.8" strokeDasharray="2 2.5" />
  </Ic>
)

/** Traumwelt: verbundene Knoten. */
export const IconRegisters = () => (
  <Ic box={32}>
    <circle cx="9" cy="9" r="4" />
    <circle cx="23" cy="9" r="4" />
    <circle cx="9" cy="23" r="4" />
    <circle cx="23" cy="23" r="4" />
    <path d="M13 9h6M9 13v6M23 13v6M13 23h6" />
  </Ic>
)

/** Dream Adventures: das Tor. */
export const IconGate = () => (
  <Ic box={32}>
    <path d="M5 28V11.5C5 7.4 9.9 4 16 4s11 3.4 11 7.5V28" />
    <path d="M5 28h22" />
    <path d="M11.5 28v-8.5c0-2.3 2-4.2 4.5-4.2s4.5 1.9 4.5 4.2V28" />
    <path d="M16 8.5l1.2 2.6 2.6 1.2-2.6 1.2L16 16.1l-1.2-2.6-2.6-1.2 2.6-1.2Z" />
  </Ic>
)

/** Verbindungen: zwei Punkte, gestrichelt verbunden. */
export const IconThesis = () => (
  <Ic box={24}>
    <circle cx="6" cy="7" r="2.6" />
    <circle cx="18" cy="17" r="2.6" />
    <path d="M8.4 8.6 15.6 15.4" strokeDasharray="2.5 2.5" />
    <circle cx="17" cy="6.5" r="1.6" />
  </Ic>
)
