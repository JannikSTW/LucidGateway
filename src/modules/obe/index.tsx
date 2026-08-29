import { registerModule } from '../../core/modules/registry'
import { registerSessionMethod } from '../../core/session/registry'
import { ProfileExtra } from '../../core/profile'
import { IconObe } from '../dream/icons'
import { ObeScreen } from './screens/ObeScreen'
import type { FieldSpec } from '../../core/ui/form/schema'
import type { StateProfile } from '../../core/types'

const GRAD_HINTS = [
  'Kein Ablösen',
  'Vibrationen',
  'Teilweise gelöst',
  'Gelöst, Raum bekannt',
  'Frei bewegt',
  'Vollständig & stabil',
]

/** Das Sitzungsformular. Reihenfolge und Wortlaut wie im Prototyp. */
const FIELDS: FieldSpec[] = [
  {
    k: 'lage',
    t: 'single',
    label: 'Ausgangslage',
    opts: ['Beim Einschlafen', 'Nach WBTB', 'Nachts aufgewacht', 'Mittagsschlaf', 'Wach im Liegen'],
  },
  {
    k: 'methode',
    t: 'single',
    label: 'Methode',
    opts: ['Spontan', 'Hemi-Sync / Gateway', 'WILD', 'Rope-Technik', 'Phasing', 'Atem & Entspannung'],
  },
  {
    k: 'focus',
    t: 'single',
    label: 'Focus-Level (Gateway)',
    opts: [
      '—',
      'Focus 10 — Körper schläft, Geist wach',
      'Focus 12 — erweitertes Gewahrsein',
      'Focus 15 — kein Zeitgefühl',
      'Focus 21 — Grenzbereich',
    ],
  },
  { k: 'audio', t: 'text', label: 'Audio / Track', ph: 'z. B. Wave I – Discovery, Track 3' },
  { k: 'haltung', t: 'single', label: 'Körperhaltung', opts: ['Rückenlage', 'Seitenlage', 'Halb aufrecht', 'Sitzend'] },
  { k: 'vorlauf', t: 'text', label: 'Vorlauf', ph: 'Wachzeit davor, Schlafmenge, Uhrzeit' },
  { k: 'intention', t: 'text', label: 'Intention', ph: 'Was hattest du dir vorgenommen?' },
  { k: 'versuche', t: 'single', label: 'Versuche in dieser Nacht', opts: ['1', '2', '3', 'mehr als 3'] },
  {
    k: 'uebergang',
    t: 'multi',
    label: 'Übergangsphänomene',
    opts: [
      'Vibrationen',
      'Rauschen / Geräusche',
      'Schlafparalyse',
      'Schweregefühl',
      'Schwingen',
      'Fallgefühl',
      'Lichtblitze',
      'Stimmen',
      'Nichts davon',
    ],
  },
  { k: 'grad', t: 'scale', label: 'Ablösungsgrad', hints: GRAD_HINTS },
  {
    k: 'bericht',
    t: 'area',
    label: 'Erlebnisbericht',
    rows: 7,
    ph: 'Übergang\nUmgebung\nWahrnehmung\nBegegnungen\nRückkehr',
  },
  {
    k: 'umgebung',
    t: 'single',
    label: 'Umgebung',
    opts: ['Bekannt & korrekt', 'Bekannt, aber verändert', 'Fremd', 'Nicht erkennbar', 'Kein Raum'],
  },
  { k: 'rueck', t: 'single', label: 'Rückkehr', opts: ['Sanft', 'Abrupt', 'Eingeschlafen', 'Nicht erinnert'] },
  {
    k: 'nach',
    t: 'multi',
    label: 'Nachwirkung',
    opts: ['Wach & klar', 'Erschöpft', 'Euphorie', 'Kopfdruck', 'Unruhe', 'Tiefe Ruhe'],
  },
  { k: 'ruhe', t: 'range', label: 'Angst ← → Ruhe', left: 'unruhig', right: 'gelassen' },
  {
    k: 'prof',
    t: 'custom',
    label: 'Zustandsprofil',
    render: (value, set) => (
      <>
        <ProfileExtra value={value} onChange={set} />
        <p className="sub small" style={{ marginTop: 2 }}>
          Dieselben fünf Dimensionen wie im Traumjournal — dadurch werden beide Zustände direkt vergleichbar.
        </p>
      </>
    ),
  },
  {
    k: 'vergleich',
    t: 'area',
    label: 'Was war anders als in einem luziden Traum?',
    rows: 4,
    ph: 'Der eigentlich spannende Teil — für den Vergleich der beiden Zustände.',
  },
]

/**
 * Außerkörperliche Erfahrung — Unterkategorie von „Luzides Träumen“ mit
 * eigenem Bereich, eigener Farbe und eigenem Sitzungsformular.
 */
export function registerObeModule(): void {
  registerSessionMethod({
    key: 'obe',
    name: 'Außerkörperliche Erfahrung',
    sub: 'Übergang & Ablösung',
    cat: 'obe',
    zone: 'obe',
    icon: <IconObe />,
    color: 'var(--cat-obe-fg)',
    tint: 'var(--cat-obe-tint)',
    presets: [20, 30, 45, 60],
    back: '/obe',
    fields: FIELDS,
    toEntry: (vals) => ({
      title: (vals.intention as string) || 'OBE-Erfahrung',
      b1: (vals.bericht as string) ?? '',
      b2: (vals.vergleich as string) ?? '',
      scale: (vals.grad as number) ?? 0,
      prof: (vals.prof as StateProfile) ?? null,
    }),
  })

  registerModule({
    id: 'obe',
    name: 'Außerkörperliche Erfahrung',
    tables: { obeMilestones: 'key' },
    routes: [{ path: 'obe', element: <ObeScreen /> }],
    categories: [
      {
        key: 'obe',
        name: 'Außerkörperliche Erfahrung',
        short: 'OBE',
        color: 'var(--cat-obe)',
        tint: 'var(--cat-obe-tint)',
        fg: 'var(--cat-obe-fg)',
        zone: 'obe',
        icon: <IconObe />,
        order: 1.5,
        sub: true,
        parent: 'ld',
        journal: {
          b1: { label: 'Erlebnisbericht', ph: 'Einschlafphase\nÜbergang\nUmgebung\nWahrnehmung\nRückkehr' },
          b2: {
            label: 'Zustand & Besonderheiten',
            ph: 'Vibrationen / Geräusche\nKörpergefühl\nAngst oder Ruhe?\nBesonderheiten\nWas war anders als im Traum?',
          },
          scale: { label: 'Ablösungsgrad', hints: GRAD_HINTS },
          tags: ['Vibrationen', 'Schlafparalyse', 'Ablösung', 'Rückkehr abrupt', 'Angstmoment'],
        },
      },
    ],
  })
}
