import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowsClockwise, Barbell } from '@phosphor-icons/react'
import { useState } from 'react'
import type { WorkoutExercise } from '@/lib/types'

interface ExerciseCardProps {
  exercise: WorkoutExercise
  onSwap?: (exerciseId: string) => void
  onLogSet?: (exerciseId: string, reps: number, weight: number) => void
  hasNewPR?: boolean
}

export function ExerciseCard({ exercise, onSwap, onLogSet, hasNewPR }: ExerciseCardProps) {
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  const handleLogSet = () => {
    if (reps && weight && onLogSet) {
      onLogSet(exercise.exerciseId, parseInt(reps), parseFloat(weight))
      setReps('')
      setWeight('')
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Barbell weight="duotone" className="text-primary" />
            <h4 className="font-semibold">{exercise.exerciseName}</h4>
            {hasNewPR && (
              <Badge className="bg-warning text-warning-foreground">
                NEW PR! 🎉
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {exercise.sets} sets × {exercise.reps} reps
          </p>
          {exercise.notes && (
            <p className="text-xs text-muted-foreground mt-1">{exercise.notes}</p>
          )}
        </div>
        {onSwap && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSwap(exercise.exerciseId)}
            className="shrink-0"
          >
            <ArrowsClockwise />
          </Button>
        )}
      </div>

      {onLogSet && (
        <div className="flex gap-2 pt-3 border-t">
          <Input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-24"
            id={`reps-${exercise.exerciseId}`}
          />
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="flex-1"
            id={`weight-${exercise.exerciseId}`}
            step="0.5"
          />
          <Button onClick={handleLogSet} disabled={!reps || !weight}>
            Log Set
          </Button>
        </div>
      )}
    </Card>
  )
}
