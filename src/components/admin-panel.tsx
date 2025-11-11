import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, MagnifyingGlass, Archive, ArrowCounterClockwise } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { Exercise } from '@/lib/types'

export function AdminPanel() {
  const [exercises, setExercises] = useKV<Exercise[]>('lifepilot-exercises', [])
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    targetMuscle: '',
    equipment: '',
  })

  const filteredExercises = exercises?.filter((ex) => {
    const matchesFilter =
      filter === 'all' || (filter === 'active' && ex.isActive) || (filter === 'archived' && !ex.isActive)
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  }) || []

  const handleOpenDialog = (exercise?: Exercise) => {
    if (exercise) {
      setEditingExercise(exercise)
      setFormData({
        name: exercise.name,
        targetMuscle: exercise.targetMuscle,
        equipment: exercise.equipment,
      })
    } else {
      setEditingExercise(null)
      setFormData({
        name: '',
        targetMuscle: '',
        equipment: '',
      })
    }
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingExercise) {
      setExercises((current) =>
        (current || []).map((ex) =>
          ex.id === editingExercise.id ? { ...ex, ...formData } : ex
        )
      )
      toast.success('Exercise updated successfully!')
    } else {
      const newExercise: Exercise = {
        id: `ex-${Date.now()}`,
        name: formData.name,
        targetMuscle: formData.targetMuscle,
        equipment: formData.equipment,
        isActive: true,
      }
      setExercises((current) => [...(current || []), newExercise])
      toast.success('Exercise created successfully!')
    }

    setDialogOpen(false)
  }

  const handleArchive = (exerciseId: string) => {
    setExercises((current) =>
      (current || []).map((ex) => (ex.id === exerciseId ? { ...ex, isActive: false } : ex))
    )
    toast.success('Exercise archived!')
  }

  const handleReactivate = (exerciseId: string) => {
    setExercises((current) =>
      (current || []).map((ex) => (ex.id === exerciseId ? { ...ex, isActive: true } : ex))
    )
    toast.success('Exercise reactivated!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage exercises and system content</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              id="exercise-search"
            />
          </div>

          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exercises</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="archived">Archived Only</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise Name</Label>
                  <Input
                    id="exercise-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-muscle">Target Muscle</Label>
                  <Input
                    id="target-muscle"
                    value={formData.targetMuscle}
                    onChange={(e) => setFormData({ ...formData, targetMuscle: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipment</Label>
                  <Input
                    id="equipment"
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingExercise ? 'Update Exercise' : 'Create Exercise'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise Name</TableHead>
                <TableHead>Target Muscle</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No exercises found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell className="font-medium">{exercise.name}</TableCell>
                    <TableCell>{exercise.targetMuscle}</TableCell>
                    <TableCell>{exercise.equipment}</TableCell>
                    <TableCell>
                      {exercise.isActive ? (
                        <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Archived</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(exercise)}>
                          Edit
                        </Button>
                        {exercise.isActive ? (
                          <Button variant="ghost" size="sm" onClick={() => handleArchive(exercise.id)}>
                            <Archive />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleReactivate(exercise.id)}>
                            <ArrowCounterClockwise />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
