import { useNavigate } from 'react-router-dom'
import { Pill } from '../../../core/ui/basics'
import { Row, Chevron } from '../../../core/ui/rows'
import { discipline } from '../db'
import type { Training } from '../types'

export function TrainingRow({ training }: { training: Training }) {
  const d = discipline(training.disc)
  const navigate = useNavigate()
  return (
    <Row
      icon={d.icon}
      tint={d.tint}
      fg={d.color}
      title={training.focus || d.name}
      sub={`${training.date} · ${training.dur ?? '–'} Min${training.venue ? ` · ${training.venue}` : ''}`}
      onClick={() => navigate(`/training/einheit/${training.id}`)}
      right={
        <>
          <Pill style={{ background: d.tint, color: d.color, borderColor: `color-mix(in srgb, ${d.color} 33%, transparent)` }}>
            RPE {training.rpe ?? '–'}
          </Pill>
          <Chevron />
        </>
      }
    />
  )
}
