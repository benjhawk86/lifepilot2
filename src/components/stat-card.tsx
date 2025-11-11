import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatCard({ label, value, unit, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('p-4 flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold stat-number">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend && (
        <div className={cn(
          'text-xs font-medium',
          trend === 'up' && 'text-success',
          trend === 'down' && 'text-destructive',
          trend === 'neutral' && 'text-muted-foreground'
        )}>
          {trend === 'up' && '↗ Trending up'}
          {trend === 'down' && '↘ Trending down'}
          {trend === 'neutral' && '→ Stable'}
        </div>
      )}
    </Card>
  )
}
