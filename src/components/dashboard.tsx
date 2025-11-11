import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatCard } from '@/components/stat-card'
import { Heart, TrendUp, Lightning } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { HealthProfile, BodyMeasurement, DietaryRecommendation } from '@/lib/types'

export function Dashboard() {
  const [profile, setProfile] = useKV<HealthProfile | null>('lifepilot-health-profile', null)
  const [measurements, setMeasurements] = useKV<BodyMeasurement[]>('lifepilot-measurements', [])
  const [dietPlan, setDietPlan] = useKV<DietaryRecommendation | null>('lifepilot-diet-plan', null)
  const [isGenerating, setIsGenerating] = useState(false)

  const [formData, setFormData] = useState<HealthProfile>(
    profile || {
      age: 30,
      weight: 70,
      height: 175,
      goal: 'maintain',
      activityLevel: 'moderate',
    }
  )

  const [measurementData, setMeasurementData] = useState({
    weight: profile?.weight || 70,
    chest: 100,
    waist: 80,
    hips: 95,
    arms: 35,
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      setProfile(formData)

      const promptText = `You are a certified nutritionist. Based on the following profile, calculate daily macronutrient targets:
      
Age: ${formData.age} years
Weight: ${formData.weight} kg
Height: ${formData.height} cm
Goal: ${formData.goal}
Activity Level: ${formData.activityLevel}

Return ONLY a JSON object with this exact structure:
{
  "calories": <number>,
  "protein": <number in grams>,
  "fats": <number in grams>,
  "carbs": <number in grams>
}

Use evidence-based calculations. For protein, aim for 1.6-2.2g per kg bodyweight for muscle building, 1.2-1.6g for maintenance, and 1.8-2.5g for weight loss (higher protein helps preserve muscle). Calculate calories based on TDEE using the Mifflin-St Jeor equation adjusted for activity level.`

      const result = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const parsed = JSON.parse(result)

      const recommendation: DietaryRecommendation = {
        calories: parsed.calories,
        protein: parsed.protein,
        fats: parsed.fats,
        carbs: parsed.carbs,
        generatedAt: new Date().toISOString(),
      }

      setDietPlan(recommendation)
      toast.success('AI dietary plan generated successfully!')
    } catch (error) {
      console.error('Error generating diet plan:', error)
      toast.error('Failed to generate dietary plan. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newMeasurement: BodyMeasurement = {
      id: `measure-${Date.now()}`,
      date: new Date().toISOString(),
      ...measurementData,
    }

    setMeasurements((current) => [newMeasurement, ...(current || [])])
    toast.success('Body measurements saved!')
  }

  const latestMeasurement = measurements?.[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track your health metrics and get AI-powered recommendations</p>
      </div>

      {dietPlan && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Daily Calories"
            value={dietPlan.calories}
            unit="kcal"
            icon={<Lightning weight="duotone" />}
          />
          <StatCard label="Protein" value={dietPlan.protein} unit="g" />
          <StatCard label="Fats" value={dietPlan.fats} unit="g" />
          <StatCard label="Carbs" value={dietPlan.carbs} unit="g" />
        </div>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Health Profile</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="diet">Dietary Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    value={formData.bodyFat || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyFat: e.target.value ? parseFloat(e.target.value) : undefined })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Select value={formData.goal} onValueChange={(value: any) => setFormData({ ...formData, goal: value })}>
                    <SelectTrigger id="goal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">Lose Weight</SelectItem>
                      <SelectItem value="build_muscle">Build Muscle</SelectItem>
                      <SelectItem value="maintain">Maintain</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value: any) => setFormData({ ...formData, activityLevel: value })}
                  >
                    <SelectTrigger id="activityLevel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Lightly Active</SelectItem>
                      <SelectItem value="moderate">Moderately Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                      <SelectItem value="extra_active">Extra Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? 'Generating AI Plan...' : 'Save & Generate Dietary Plan'}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card className="p-6">
            <form onSubmit={handleMeasurementSubmit} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="measure-weight">Weight (kg)</Label>
                  <Input
                    id="measure-weight"
                    type="number"
                    step="0.1"
                    value={measurementData.weight}
                    onChange={(e) => setMeasurementData({ ...measurementData, weight: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chest">Chest (cm)</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.1"
                    value={measurementData.chest}
                    onChange={(e) => setMeasurementData({ ...measurementData, chest: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waist">Waist (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.1"
                    value={measurementData.waist}
                    onChange={(e) => setMeasurementData({ ...measurementData, waist: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hips">Hips (cm)</Label>
                  <Input
                    id="hips"
                    type="number"
                    step="0.1"
                    value={measurementData.hips}
                    onChange={(e) => setMeasurementData({ ...measurementData, hips: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arms">Arms (cm)</Label>
                  <Input
                    id="arms"
                    type="number"
                    step="0.1"
                    value={measurementData.arms}
                    onChange={(e) => setMeasurementData({ ...measurementData, arms: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save Measurements
              </Button>
            </form>
          </Card>

          {latestMeasurement && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Latest Measurements</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard label="Weight" value={latestMeasurement.weight} unit="kg" icon={<Heart weight="duotone" />} />
                <StatCard label="Chest" value={latestMeasurement.chest || '-'} unit="cm" />
                <StatCard label="Waist" value={latestMeasurement.waist || '-'} unit="cm" />
                <StatCard label="Hips" value={latestMeasurement.hips || '-'} unit="cm" />
                <StatCard label="Arms" value={latestMeasurement.arms || '-'} unit="cm" />
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="diet" className="space-y-4">
          {dietPlan ? (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lightning weight="duotone" className="text-primary" size={32} />
                <div>
                  <h3 className="font-semibold text-lg">Your AI-Generated Dietary Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Generated on {new Date(dietPlan.generatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Daily Targets</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Calories</span>
                      <span className="font-bold text-lg stat-number">{dietPlan.calories} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Protein</span>
                      <span className="font-bold text-lg stat-number">{dietPlan.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Fats</span>
                      <span className="font-bold text-lg stat-number">{dietPlan.fats}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Carbohydrates</span>
                      <span className="font-bold text-lg stat-number">{dietPlan.carbs}g</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Macro Distribution</h4>
                  <div className="space-y-2">
                    {(() => {
                      const totalCals = dietPlan.protein * 4 + dietPlan.fats * 9 + dietPlan.carbs * 4
                      const proteinPct = Math.round((dietPlan.protein * 4 * 100) / totalCals)
                      const fatPct = Math.round((dietPlan.fats * 9 * 100) / totalCals)
                      const carbPct = Math.round((dietPlan.carbs * 4 * 100) / totalCals)
                      return (
                        <>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Protein</span>
                              <span className="font-medium">{proteinPct}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${proteinPct}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fats</span>
                              <span className="font-medium">{fatPct}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-warning" style={{ width: `${fatPct}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Carbs</span>
                              <span className="font-medium">{carbPct}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-success" style={{ width: `${carbPct}%` }} />
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Lightning weight="duotone" className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="font-semibold text-lg mb-2">No Dietary Plan Generated Yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your health profile and generate an AI-powered dietary plan
              </p>
              <Button onClick={() => document.querySelector<HTMLElement>('[value="profile"]')?.click()}>
                Go to Profile
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
