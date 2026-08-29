import { NODE_ICONS, type AdvNode } from '../board'

/** Ein Knoten-Icon der Tafel. */
export function NodeIcon({ ic }: { ic: string }) {
  return <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: NODE_ICONS[ic] ?? '' }} />
}

const centerY = (n: AdvNode) => n.y + (n.col === 'big' ? 27 : 23)

/**
 * Die Tafel: Knoten liegen an festen Koordinaten wie auf dem Original,
 * die Linien laufen als Bézier dazwischen.
 */
export function Tree({
  nodes,
  edges,
  height,
  onOpen,
}: {
  nodes: Record<string, AdvNode>
  edges: [string, string, string?][]
  height: number
  onOpen: (key: string) => void
}) {
  return (
    <div className="treewrap">
      <div className="tree" style={{ height }}>
        <svg className="lines" height={height} viewBox={`0 0 354 ${height}`} aria-hidden="true">
          {edges.map(([a, b, cls], i) => {
            const A = nodes[a]
            const B = nodes[b]
            if (!A || !B) return null
            const d =
              A.x === B.x
                ? `M${A.x} ${centerY(A) + 26} L${B.x} ${centerY(B) - 26}`
                : `M${A.x} ${centerY(A)} C${(A.x + B.x) / 2} ${centerY(A)}, ${(A.x + B.x) / 2} ${centerY(B)}, ${B.x} ${centerY(B)}`
            return <path key={`${a}-${b}-${i}`} className={cls || undefined} d={d} />
          })}
        </svg>
        {Object.entries(nodes).map(([key, n]) => (
          <button
            key={key}
            type="button"
            className={`node ${n.col}`.trim()}
            style={{ left: n.x, top: n.y }}
            onClick={() => onOpen(key)}
          >
            <span className="nic">
              <NodeIcon ic={n.ic} />
            </span>
            <span className="nlb">{n.lb}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
