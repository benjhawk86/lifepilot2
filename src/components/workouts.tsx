import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExerciseCard } from '@/components/exercise-card'
import { StatCard } from '@/components/stat-card'
import { Barbell, Lightning, TrendUp } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { WorkoutPlan, LoggedSet, PersonalRecord, WorkoutExercise } from '@/lib/types'

export function Workouts() {
  const [workoutPlan, setWorkoutPlan] = useKV<WorkoutPlan | null>('lifepilot-workout-plan', null)
  const [loggedSets, setLoggedSets] = useKV<LoggedSet[]>('lifepilot-logged-sets', [])
  const [personalRecords, setPersonalRecords] = useKV<PersonalRecord[]>('lifepilot-prs', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [swapDialogOpen, setSwapDialogOpen] = useState(false)
  const [swapSuggestions, setSwapSuggestions] = useState<WorkoutExercise[]>([])
  const [swappingExercise, setSwappingExercise] = useState<{ dayNumber: number; exerciseId: string } | null>(null)
  const [newPRs, setNewPRs] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState({
    goal: 'build_muscle',
    daysPerWeek: 4,
    duration: '60',
    equipment: 'full_gym',
  })

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const promptText = `You are a professional fitness trainer. Create a detailed 7-day workout plan with the following requirements:

Goal: ${formData.goal}
Days per week: ${formData.daysPerWeek}
Session duration: ${formData.duration} minutes
Equipment: ${formData.equipment}

Return ONLY a JSON object with this structure:
{
  "schedule": [
    {
      "day": "Monday",
      "dayNumber": 1,
      "isRestDay": false,
      "exercises": [
        {
          "exerciseId": "ex-<unique-id>",
          "exerciseName": "<exercise name>",
          "sets": <number>,
          "reps": "<rep range like 8-12>",
          "notes": "<optional coaching tip>"
        }
      ]
    }
  ]
}

Create ${formData.daysPerWeek} workout days and ${7 - formData.daysPerWeek} rest days. For workout days, include 4-6 exercises targeting different muscle groups. Use evidence-based exercise selection and progressive overload principles.`

      const result = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const parsed = JSON.parse(result)

      const plan: WorkoutPlan = {
        id: `plan-${Date.now()}`,
        userId: 'current-user',
        goal: formData.goal,
        daysPerWeek: formData.daysPerWeek,
        duration: formData.duration,
        equipment: [formData.equipment],
        schedule: parsed.schedule,
        createdAt: new Date().toISOString(),
      }

      setWorkoutPlan(plan)
      toast.success('Workout plan generated successfully!')
    } catch (error) {
      console.error('Error generating workout plan:', error)
      toast.error('Failed to generate workout plan. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSwapExercise = async (dayNumber: number, exerciseId: string) => {
    setSwappingExercise({ dayNumber, exerciseId })
    
    const day = workoutPlan?.schedule.find((d) => d.dayNumber === dayNumber)
    const exercise = day?.exercises.find((e) => e.exerciseId === exerciseId)

    if (!exercise) return

    try {
      const promptText = `You are a fitness expert. Suggest 3 alternative exercises to replace "${exercise.exerciseName}".

Return ONLY a JSON object with this structure:
{
  "alternatives": [
    {
      "exerciseId": "ex-<unique-id>",
      "exerciseName": "<exercise name>",
      "sets": ${exercise.sets},
      "reps": "${exercise.reps}",
      "notes": "<why this is a good alternative>"
    }
  ]
}

The alternatives should target similar muscle groups and have similar difficulty.`

      const result = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const parsed = JSON.parse(result)
      
      setSwapSuggestions(parsed.alternatives)
      setSwapDialogOpen(true)
    } catch (error) {
      console.error('Error getting swap suggestions:', error)
      toast.error('Failed to get exercise suggestions. Please try again.')
    }
  }

  const handleSelectSwap = (selectedExercise: WorkoutExercise) => {
    if (!swappingExercise || !workoutPlan) return

    setWorkoutPlan((currentPlan) => {
      if (!currentPlan) return null

      const newSchedule = currentPlan.schedule.map((day) => {
        if (day.dayNumber === swappingExercise.dayNumber) {
          return {
            ...day,
            exercises: day.exercises.map((ex) =>
              ex.exerciseId === swappingExercise.exerciseId ? selectedExercise : ex
            ),
          }
        }
        return day
      })

      return {
        ...currentPlan,
        schedule: newSchedule,
      }
    })

    setSwapDialogOpen(false)
    setSwappingExercise(null)
    toast.success('Exercise swapped successfully!')
  }

  const handleLogSet = (exerciseId: string, exerciseName: string, reps: number, weight: number) => {
    const volume = reps * weight

    const newSet: LoggedSet = {
      id: `set-${Date.now()}`,
      userId: 'current-user',
      exerciseId,
      exerciseName,
      reps,
      weight,
      volume,
      date: new Date().toISOString(),
    }

    setLoggedSets((current) => [...(current || []), newSet])

    const existingPR = personalRecords?.find((pr) => pr.exerciseId === exerciseId)

    if (!existingPR || volume > existingPR.maxVolume) {
      const newPR: PersonalRecord = {
        id: `pr-${Date.now()}`,
        userId: 'current-user',
        exerciseId,
        exerciseName,
        maxVolume: volume,
        reps,
        weight,
        achievedAt: new Date().toISOString(),
      }

      setPersonalRecords((current) => {
        const filtered = (current || []).filter((pr) => pr.exerciseId !== exerciseId)
        return [...filtered, newPR]
      })

      setNewPRs((current) => new Set([...current, exerciseId]))
      toast.success(`🎉 New PR! ${exerciseName}: ${reps} × ${weight}kg`)

      setTimeout(() => {
        setNewPRs((current) => {
          const updated = new Set(current)
          updated.delete(exerciseId)
          return updated
        })
      }, 5000)
    } else {
      toast.success('Set logged successfully!')
    }
  }

  const totalWorkouts = loggedSets?.length || 0
  const totalVolume = loggedSets?.reduce((sum, set) => sum + set.volume, 0) || 0
  const prCount = personalRecords?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Workouts</h1>
        <p className="text-muted-foreground">Generate AI-powered workout plans and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Sets Logged" value={totalWorkouts} icon={<Barbell weight="duotone" />} />
        <StatCard label="Total Volume" value={Math.round(totalVolume)} unit="kg" icon={<TrendUp weight="duotone" />} />
        <StatCard label="Personal Records" value={prCount} icon={<Lightning weight="duotone" />} />
      </div>

      {!workoutPlan ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Your Workout Plan</h2>
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workout-goal">Fitness Goal</Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                  <SelectTrigger id="workout-goal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="build_muscle">Build Muscle</SelectItem>
                    <SelectItem value="strength">Build Strength</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="days-per-week">Days Per Week</Label>
                <Select
                  value={formData.daysPerWeek.toString()}
                  onValueChange={(value) => setFormData({ ...formData, daysPerWeek: parseInt(value) })}
                >
                  <SelectTrigger id="days-per-week">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="4">4 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="6">6 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Session Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Available Equipment</Label>
                <Select value={formData.equipment} onValueChange={(value) => setFormData({ ...formData, equipment: value })}>
                  <SelectTrigger id="equipment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_gym">Full Gym</SelectItem>
                    <SelectItem value="dumbbells">Dumbbells Only</SelectItem>
                    <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                    <SelectItem value="home_gym">Home Gym</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? 'Generating Plan...' : 'Generate AI Workout Plan'}
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Your 7-Day Workout Plan</h2>
              <p className="text-sm text-muted-foreground">
                {formData.daysPerWeek} days/week • {formData.duration} min sessions
              </p>
            </div>
            <Button variant="outline" onClick={() => setWorkoutPlan(null)}>
              New Plan
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {workoutPlan.schedule.map((day) => (
              <AccordionItem key={day.dayNumber} value={day.day}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{day.day}</span>
                    {day.isRestDay ? (
                      <span className="text-sm text-muted-foreground">Rest Day</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">{day.exercises.length} exercises</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {day.isRestDay ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>Recovery day - let your muscles rest and grow</p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {day.exercises.map((exercise) => (
                        <ExerciseCard
                          key={exercise.exerciseId}
                          exercise={exercise}
                          onSwap={() => handleSwapExercise(day.dayNumber, exercise.exerciseId)}
                          onLogSet={(id, reps, weight) => handleLogSet(id, exercise.exerciseName, reps, weight)}
                          hasNewPR={newPRs.has(exercise.exerciseId)}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      )}

      <Dialog open={swapDialogOpen} onOpenChange={setSwapDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Alternative Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {swapSuggestions.map((suggestion) => (
              <Card key={suggestion.exerciseId} className="p-4 cursor-pointer hover:border-primary" onClick={() => handleSelectSwap(suggestion)}>
                <h4 className="font-semibold mb-1">{suggestion.exerciseName}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {suggestion.sets} sets × {suggestion.reps} reps
                </p>
                {suggestion.notes && <p className="text-xs text-muted-foreground">{suggestion.notes}</p>}
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
