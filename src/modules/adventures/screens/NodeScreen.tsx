import { useNavigate, useParams } from 'react-router-dom'
import { Empty } from '../../../core/ui/basics'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { NodeIcon } from '../components/Tree'
import { ALL_NODES, EDGES, SKILL_EDGES } from '../board'
import '../chalk.css'

export function NodeScreen() {
  const { key = '' } = useParams()
  const node = ALL_NODES[key]
  const navigate = useNavigate()

  if (!node) {
    return (
      <Screen className="chalk">
        <ScreenHeader title="Unbekannt" titleClass="chalk-h" back="/adventures" />
        <Scroll>
          <Empty>Diesen Knoten gibt es auf der Tafel nicht.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const next = [...EDGES.map(([a, b]) => [a, b]), ...SKILL_EDGES]
    .filter(([a]) => a === key)
    .map(([, b]) => b)

  return (
    <Screen className="chalk">
      <ScreenHeader
        eyebrow={<span style={{ color: 'var(--chalk-dim)' }}>{node.kind}</span>}
        title={node.lb.replace(/-(?=[a-zä])/g, '')}
        titleClass="chalk-h"
        icon={<NodeIcon ic={node.ic} />}
        tint="rgba(237,237,230,.08)"
        fg="var(--chalk)"
        back="/adventures"
      />
      <Scroll tight>
        <div className="chalk-card">
          <p style={{ marginTop: 0 }}>{node.tx}</p>
        </div>
        <div className="chalk-card">
          <div className="eyebrow" style={{ color: 'var(--chalk-dim)' }}>
            Auf der Tafel
          </div>
          <p>
            Stand {node.kind.includes('Ziel') ? 'am Ende' : 'in der Spalte'} „{node.kind.split(' · ')[0]}“ der
            Originalnotizen von 2024.
          </p>
        </div>

        {next.length > 0 && (
          <>
            <div className="chalk-label">Führt weiter zu</div>
            {next.map((t) => (
              <button
                key={t}
                type="button"
                className="chalk-card tap"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)' }}
                onClick={() => navigate(`/adventures/${t}`)}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '1.3px solid rgba(237,237,230,.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--chalk)',
                    flexShrink: 0,
                  }}
                >
                  <NodeIcon ic={ALL_NODES[t]?.ic ?? 'info'} />
                </span>
                <b style={{ fontSize: '14.5px' }}>{ALL_NODES[t]?.lb}</b>
              </button>
            ))}
          </>
        )}

        <button
          type="button"
          className="btn ghost"
          style={{ borderColor: 'rgba(237,237,230,.3)', color: '#b9b9b1', marginTop: 'var(--sp-3)' }}
          onClick={() => navigate('/adventures')}
        >
          Zurück zur Tafel
        </button>
      </Scroll>
    </Screen>
  )
}
