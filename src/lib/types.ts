export interface User {
  id: string
  email: string
  role: 'general' | 'admin'
  createdAt: string
}

export interface HealthProfile {
  age: number
  weight: number
  height: number
  bodyFat?: number
  goal: 'lose_weight' | 'build_muscle' | 'maintain' | 'endurance'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active'
}

export interface BodyMeasurement {
  id: string
  date: string
  weight: number
  chest?: number
  waist?: number
  hips?: number
  arms?: number
}

export interface DietaryRecommendation {
  calories: number
  protein: number
  fats: number
  carbs: number
  generatedAt: string
}

export interface Exercise {
  id: string
  name: string
  targetMuscle: string
  equipment: string
  isActive: boolean
}

export interface WorkoutExercise {
  exerciseId: string
  exerciseName: string
  sets: number
  reps: string
  notes?: string
}

export interface WorkoutDay {
  day: string
  dayNumber: number
  exercises: WorkoutExercise[]
  isRestDay: boolean
}

export interface WorkoutPlan {
  id: string
  userId: string
  goal: string
  daysPerWeek: number
  duration: string
  equipment: string[]
  schedule: WorkoutDay[]
  createdAt: string
}

export interface LoggedSet {
  id: string
  userId: string
  exerciseId: string
  exerciseName: string
  reps: number
  weight: number
  volume: number
  date: string
}

export interface PersonalRecord {
  id: string
  userId: string
  exerciseId: string
  exerciseName: string
  maxVolume: number
  reps: number
  weight: number
  achievedAt: string
}
