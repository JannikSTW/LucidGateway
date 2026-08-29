import { useNavigate } from 'react-router-dom'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Tree } from '../components/Tree'
import { CHALLENGES, EDGES, NODES, RANKS, REAL_WORLD, SKILLS, SKILL_EDGES } from '../board'
import { toggleChallenge, useChallengeState } from '../db'
import { useToast } from '../../../core/ui/toast'
import '../chalk.css'

export function AdventuresScreen() {
  const navigate = useNavigate()
  const done = useChallengeState()
  const toast = useToast()

  const doneCount = CHALLENGES.filter((c) => done[c.key]).length
  const level = Math.min(Math.max(doneCount - 1, 0), RANKS.length - 1)

  const toggle = async (key: string) => {
    const wasDone = !!done[key]
    await toggleChallenge(key, wasDone)
    if (!wasDone) toast('Im Traum geschafft :)')
  }

  return (
    <Screen className="chalk">
      <ScreenHeader
        eyebrow={<span style={{ color: 'var(--chalk-green)' }}>Luzides Träumen</span>}
        title="Dream Adventures"
        titleClass="chalk-h"
        back="/kategorie/ld"
      />
      <Scroll tight>
        <p className="chalk-intro">
          Der Skill-Tree von 2024, so wie er auf der Tafel stand. Tippe auf jeden Knoten, um mehr zu erfahren.
          Nichts hier ist Pflicht — es ist eine Landkarte, kein Lehrplan.
        </p>

        <div className="chalk-label">Die Tafel</div>
        <Tree nodes={NODES} edges={EDGES} height={950} onOpen={(k) => navigate(`/adventures/${k}`)} />

        <div className="chalk-label">Dream Skills</div>
        <Tree
          nodes={SKILLS}
          edges={SKILL_EDGES.map(([a, b]) => [a, b, ''])}
          height={560}
          onOpen={(k) => navigate(`/adventures/${k}`)}
        />

        <div className="chalk-label">Challenges</div>
        <div className="chalk-card">
          {CHALLENGES.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`chal${done[c.key] ? ' done' : ''}`}
              onClick={() => void toggle(c.key)}
            >
              <span className="bx">{done[c.key] ? '✓' : ''}</span>
              <span className="ct">
                <b>{c.t}</b>
                <span>{c.s}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="chalk-label">Ränge</div>
        <div className="chalk-card">
          {RANKS.map((r, i) => (
            <div
              key={r}
              className={`rank${doneCount && i === level ? ' on' : ''}${!doneCount || i > level ? ' locked' : ''}`}
            >
              <span className="rn">{i + 1}</span>
              <div>
                <b>{r}</b>
                {doneCount > 0 && i === level && <small>aktueller Rang</small>}
              </div>
            </div>
          ))}
          <p style={{ fontSize: '11.5px', color: '#8b8b84', fontFamily: 'var(--font-ui)', marginTop: 10, lineHeight: 1.5 }}>
            Reihenfolge der Ränge aus den Originalnotizen nicht eindeutig — hier aufsteigend interpretiert.
          </p>
        </div>

        <div className="chalk-label">Real World Applications</div>
        <div className="chalk-card">
          <p style={{ marginTop: 0 }}>
            Der Teil der alten Tafel, der über den Traum hinauswies — und rückblickend der stärkste.
          </p>
          <div className="adv-real">{REAL_WORLD.join(' · ')}</div>
        </div>

        <p className="adv-note">
          Dieser Bereich ist bewusst abgekapselt: ein Spielfeld, kein Lehrplan. Was du hier abhakst, ist deine
          eigene Schatzkarte und fließt nicht in deine Journal-Auswertung ein. Die Forschung findet nebenan statt.
        </p>
      </Scroll>
    </Screen>
  )
}
