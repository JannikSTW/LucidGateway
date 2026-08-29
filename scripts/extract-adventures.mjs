// Zieht die Tafel-Daten aus dem Prototyp, statt sie abzutippen.
import { readFileSync, writeFileSync } from 'node:fs'
import vm from 'node:vm'

const html = readFileSync('design-reference/prototype.html', 'utf8')
const between = (start, end) => {
  const a = html.indexOf(start)
  const b = html.indexOf(end, a)
  if (a < 0 || b < 0) throw new Error('nicht gefunden: ' + start)
  return html.slice(a, b)
}

const src = [
  between('const NI = {', '\nconst nsvg'),
  between('const L=58,C=177,R=296;', '\nconst EDGES'),
  between('const EDGES = [', '\n\n/* --- Dream-Skills-Baum --- */'),
  between('const SKILLS = {', '\nconst SKILL_EDGES'),
  between('const SKILL_EDGES = [', '\n\nlet ALL'),
  between('let ADV_CHALLENGES = [', '\nconst ADV_RANKS'),
  between("const ADV_RANKS = [", '\n\nfunction openAdv'),
  'globalThis.out = { NI, NODES, EDGES, SKILLS, SKILL_EDGES, ADV_CHALLENGES, ADV_RANKS };',
].join('\n')

const ctx = {}
vm.createContext(ctx)
vm.runInContext(src, ctx)
const out = ctx.out

const esc = (s) => JSON.stringify(s)

const nodeLines = (obj) =>
  Object.entries(obj)
    .map(
      ([k, n]) =>
        `  ${k}: { x: ${n.x}, y: ${n.y}, ic: ${esc(n.ic)}, lb: ${esc(n.lb)}, col: ${esc(n.col)}, kind: ${esc(n.kind)}, tx: ${esc(n.tx)} },`,
    )
    .join('\n')

const file = `/**
 * Die Tafel von 2024, Knoten für Knoten aus dem Prototyp übernommen.
 * Erzeugt mit scripts/extract-adventures.mjs — von Hand abtippen wäre eine
 * Fehlerquelle, und die Originalnotizen sollen unverändert bleiben.
 */

export interface AdvNode {
  x: number
  y: number
  ic: string
  lb: string
  col: string
  kind: string
  tx: string
}

/** Spaltenmitten der Tafel. */
export const L = 58
export const C = 177
export const R = 296

/** Icon-Pfade der Knoten. */
export const NODE_ICONS: Record<string, string> = {
${Object.entries(out.NI)
  .map(([k, v]) => `  ${k}: ${esc(v)},`)
  .join('\n')}
}

export const NODES: Record<string, AdvNode> = {
${nodeLines(out.NODES)}
}

export const EDGES: [string, string, string][] = ${JSON.stringify(out.EDGES)}

export const SKILLS: Record<string, AdvNode> = {
${nodeLines(out.SKILLS)}
}

export const SKILL_EDGES: [string, string][] = ${JSON.stringify(out.SKILL_EDGES)}

export const ALL_NODES: Record<string, AdvNode> = { ...NODES, ...SKILLS }

export interface Challenge {
  key: string
  t: string
  s: string
}

/** Der einzige Ort der App mit Abhak-Logik — bewusst abgetrennt. */
export const CHALLENGES: Challenge[] = [
${out.ADV_CHALLENGES.map((c, i) => `  { key: ${esc('ch' + (i + 1))}, t: ${esc(c.t)}, s: ${esc(c.s)} },`).join('\n')}
]

export const RANKS: string[] = ${JSON.stringify(out.ADV_RANKS)}

export const REAL_WORLD = [
  'Skill Learning',
  'Face Your Fears',
  'Tough Situations',
  'Problem Solving',
  'Public Speaking',
  'Leadership',
  'Dream Art',
  'Therapeutic Methods',
  'Dream Healing',
  'Conversing with your Dream Self',
  'Body/Mind Connection',
  'Physical Healing',
]
`

writeFileSync('src/modules/adventures/board.ts', file)
console.log(
  'Knoten:', Object.keys(out.NODES).length,
  '· Skills:', Object.keys(out.SKILLS).length,
  '· Kanten:', out.EDGES.length + out.SKILL_EDGES.length,
  '· Challenges:', out.ADV_CHALLENGES.length,
)
