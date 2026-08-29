import { useParams } from 'react-router-dom'
import { Screen } from '../../../core/ui/layout'
import { useTrainings } from '../db'
import { TrainFormScreen } from './TrainFormScreen'
import { WorkoutScreen } from './WorkoutScreen'

/** Krafteinheiten werden mit Übungsliste bearbeitet, alle anderen im Formular. */
export function TrainEditScreen() {
  const { id } = useParams()
  const editId = Number(id)
  const training = (useTrainings() ?? []).find((t) => t.id === editId)
  if (!training) return <Screen zone="ms" />
  return training.disc === 'kraft' ? <WorkoutScreen editId={editId} /> : <TrainFormScreen editId={editId} />
}
