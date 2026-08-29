import { Empty } from '../../../core/ui/basics'
import { Legend, MapNote } from '../../../core/ui/data'
import { clip } from '../../../core/util/text'
import { partCount, partDist, partLinkType, roleColor, roleOrder } from '../db'
import type { InnerWorld } from '../db'

const W = 340
const H = 340
const CX = W / 2
const CY = H / 2

/**
 * Landkarte der Anteile. Eine Frage: Wer ist in mir da, wie nah komme ich ran?
 * Zentrum = Selbst, Sektor = Rolle (frei vergeben), Entfernung = Zugänglichkeit.
 */
export function IfsMap({ world, onOpen }: { world: InnerWorld; onOpen: (name: string) => void }) {
  if (!world.parts.length) {
    return (
      <Empty>
        Noch leer.
        <br />
        Lege einen Anteil an oder tippe in einer Sitzung an, wer sich gezeigt hat.
      </Empty>
    )
  }

  const usedRoles = roleOrder(world.parts).filter((r) =>
    world.parts.some((p) => p.profile?.role === r),
  )
  const withoutRole = world.parts.filter((p) => !p.profile?.role)
  const sectorCount = usedRoles.length + (withoutRole.length ? 1 : 0)
  const angleOf = (i: number) => -90 + i * (360 / Math.max(sectorCount, 1))

  const pos = new Map<string, { x: number; y: number }>()
  const nodes: { name: string; x: number; y: number; size: number; filled: boolean; color: string }[] = []

  const place = (list: typeof world.parts, sectorIndex: number, color: string) => {
    const base = angleOf(sectorIndex)
    const span = Math.min(70, 300 / Math.max(sectorCount, 1))
    list.forEach((p, i) => {
      const step = list.length > 1 ? span / (list.length - 1) : 0
      const ang = ((base - span / 2 + (list.length > 1 ? i * step : span / 2)) * Math.PI) / 180
      const d = partDist(p)
      const r = 34 + (d / 10) * 112
      const x = CX + r * Math.cos(ang)
      const y = CY + r * Math.sin(ang)
      pos.set(p.name, { x, y })
      nodes.push({
        name: p.name,
        x,
        y,
        size: 8 + Math.min(partCount(world.entries, p.name), 6) * 1.9,
        filled: !!p.profile,
        color,
      })
    })
  }

  usedRoles.forEach((role, i) =>
    place(
      world.parts.filter((p) => p.profile?.role === role),
      i,
      roleColor(role, world.parts),
    ),
  )
  if (withoutRole.length) place(withoutRole, usedRoles.length, 'var(--mist)')

  return (
    <>
      <svg viewBox={`-10 -10 ${W + 20} ${H + 20}`} className="mapsvg">
        {/* „Alltags-Ich“: der Ring, in dem Anteile mit am Steuer sitzen */}
        <circle cx={CX} cy={CY} r="56" fill="none" stroke="var(--line)" strokeWidth=".9" strokeDasharray="4 3" />
        {[90, 124, 146].map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="var(--line)" strokeWidth=".6" strokeDasharray="2 6" />
        ))}
        {sectorCount > 1 &&
          Array.from({ length: sectorCount }, (_, i) => {
            const a = ((angleOf(i) + 180 / sectorCount) * Math.PI) / 180
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={(CX + 160 * Math.cos(a)).toFixed(1)}
                y2={(CY + 160 * Math.sin(a)).toFixed(1)}
                stroke="var(--line)"
                strokeWidth=".5"
              />
            )
          })}

        {usedRoles.map((role, i) => {
          const a = (angleOf(i) * Math.PI) / 180
          return (
            <text
              key={role}
              x={(CX + 162 * Math.cos(a)).toFixed(1)}
              y={(CY + 162 * Math.sin(a)).toFixed(1)}
              textAnchor="middle"
              fontSize="9"
              fill={roleColor(role, world.parts)}
              opacity=".85"
            >
              {clip(role, 16)}
            </text>
          )
        })}
        {withoutRole.length > 0 &&
          (() => {
            const a = (angleOf(usedRoles.length) * Math.PI) / 180
            return (
              <text
                x={(CX + 162 * Math.cos(a)).toFixed(1)}
                y={(CY + 162 * Math.sin(a)).toFixed(1)}
                textAnchor="middle"
                fontSize="9"
                fill="var(--mist)"
                opacity=".8"
              >
                ohne Rolle
              </text>
            )
          })()}

        {/* Beziehungen als gebogene Linien */}
        {world.links.map((l) => {
          const A = pos.get(l.a)
          const B = pos.get(l.b)
          if (!A || !B) return null
          const t = partLinkType(l.type)
          const mx = (A.x + B.x) / 2
          const my = (A.y + B.y) / 2
          const dx = B.x - A.x
          const dy = B.y - A.y
          const len = Math.hypot(dx, dy) || 1
          const bow = Math.min(len * 0.18, 26)
          const qx = mx - (dy / len) * bow
          const qy = my + (dx / len) * bow
          const ang = Math.atan2(B.y - qy, B.x - qx)
          const ax = B.x - Math.cos(ang) * 11
          const ay = B.y - Math.sin(ang) * 11
          return (
            <g key={l.id}>
              <path
                d={`M${A.x.toFixed(1)} ${A.y.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`}
                fill="none"
                stroke={t.color}
                strokeOpacity=".7"
                strokeWidth="1.6"
                strokeDasharray={l.type === 'konflikt' ? '4 3' : undefined}
              />
              {t.directed && (
                <path
                  d={`M${(ax - Math.cos(ang - 0.5) * 6).toFixed(1)} ${(ay - Math.sin(ang - 0.5) * 6).toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)} L${(ax - Math.cos(ang + 0.5) * 6).toFixed(1)} ${(ay - Math.sin(ang + 0.5) * 6).toFixed(1)}`}
                  fill="none"
                  stroke={t.color}
                  strokeOpacity=".8"
                  strokeWidth="1.5"
                />
              )}
            </g>
          )
        })}

        {nodes.map((n) => (
          <g key={n.name} style={{ cursor: 'pointer' }} onClick={() => onOpen(n.name)}>
            <line
              x1={CX}
              y1={CY}
              x2={n.x.toFixed(1)}
              y2={n.y.toFixed(1)}
              stroke={n.color}
              strokeOpacity=".3"
              strokeWidth="1"
              strokeDasharray={n.filled ? undefined : '3 3'}
            />
            <circle
              cx={n.x.toFixed(1)}
              cy={n.y.toFixed(1)}
              r={n.size}
              fill={n.filled ? `color-mix(in srgb, ${n.color} 23%, transparent)` : 'transparent'}
              stroke={n.color}
              strokeWidth="1.5"
            />
            <text
              x={n.x.toFixed(1)}
              y={(n.y + n.size + 11).toFixed(1)}
              textAnchor="middle"
              fontSize="9"
              fill="var(--mist)"
            >
              {clip(n.name, 14)}
            </text>
          </g>
        ))}

        <circle cx={CX} cy={CY} r="19" fill="var(--cat-ai-tint)" stroke="var(--cat-ai-fg)" strokeWidth="1.5" />
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="10.5" fill="var(--cat-ai-fg)">
          Selbst
        </text>
        <text x={CX} y={CY - 33} textAnchor="middle" fontSize="8.5" fill="var(--mist)">
          Alltags-Ich
        </text>
      </svg>

      {world.links.length > 0 && (
        <Legend
          center
          items={[...new Set(world.links.map((l) => l.type))].map((t) => ({
            label: partLinkType(t).label,
            color: partLinkType(t).color,
            line: true,
          }))}
        />
      )}

      <MapNote>
        Abstand = Zugänglichkeit · Sektor = Rolle, von dir vergeben
        <br />
        gefüllt = profiliert · Größe = wie oft aufgetaucht
      </MapNote>
    </>
  )
}
