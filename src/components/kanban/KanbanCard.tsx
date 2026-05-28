'use client'

import { Clock, AlertCircle } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Badge } from '@/components/ui/badge'
import { priorityLabel, priorityClasses, formatDate, isCardOverdue } from '@/lib/card-utils'
import type { CardListItem } from '@/types/card.types'

interface KanbanCardProps {
  card: CardListItem
  onClick: () => void
}

export function KanbanCard({ card, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id })

  const overdue = isCardOverdue(card.due_date)

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...attributes}
      {...listeners}
      onClick={() => { if (!isDragging) onClick() }}
      className="group w-full rounded-2xl border border-zinc-100 bg-white p-3 text-left shadow-sm transition-shadow hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <Badge variant="outline" className={`rounded-full text-xs ${priorityClasses[card.priority]}`}>
          {priorityLabel[card.priority]}
        </Badge>
      </div>

      <p className="line-clamp-2 text-sm font-medium text-zinc-800">{card.title}</p>

      {card.description && (
        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{card.description}</p>
      )}

      {card.due_date && (
        <div className={`mt-3 flex items-center gap-1.5 border-t border-zinc-100 pt-2 text-xs ${overdue ? 'text-red-500' : 'text-zinc-500'}`}>
          <Clock className="h-3 w-3" />
          <span>{formatDate(card.due_date)}</span>
          {overdue && <AlertCircle className="ml-auto h-3 w-3" />}
        </div>
      )}
    </div>
  )
}