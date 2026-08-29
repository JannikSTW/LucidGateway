import { useNavigate } from 'react-router-dom'
import { Button, Text } from '../../../core/ui/basics'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { DISCIPLINES, useTemplates } from '../db'
import { plural } from '../../../core/util/text'

export function KraftPickScreen() {
  const templates = useTemplates() ?? []
  const navigate = useNavigate()
  const d = DISCIPLINES.kraft

  return (
    <Screen zone="ms">
      <ScreenHeader
        eyebrow="Krafttraining"
        title="Welche Einheit?"
        icon={d.icon}
        tint={d.tint}
        fg={d.color}
        back="/training/kraft"
      />
      <Scroll tight>
        <Text small style={{ marginBottom: 'var(--sp-7)' }}>
          Balkon-Gym: Turm mit Klimmzugstange, Dipstangen und Beinheber-Polster · Liegestützgriffe · Ab Wheel ·
          Hanteln bis 16 kg · Sandbag 30 kg. Turm steht frei — kein Schwungholen.
        </Text>

        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            className="tplcard split"
            onClick={() => navigate(`/training/kraft/einheit/${t.key}`)}
          >
            <b>{t.name}</b>
            <span>{plural(t.ex.length, 'Übung', 'Übungen')} ›</span>
          </button>
        ))}

        <button type="button" className="tplcard dashed" onClick={() => navigate('/training/kraft/einheit/frei')}>
          <b>Freies Training</b>
          <span>Ohne Vorlage — Übungen unterwegs ergänzen.</span>
        </button>

        <Button ghost onClick={() => navigate('/training/vorlagen')} style={{ marginTop: 'var(--sp-3)' }}>
          Vorlagen bearbeiten
        </Button>
      </Scroll>
    </Screen>
  )
}
