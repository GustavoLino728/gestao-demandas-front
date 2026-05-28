import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { priorityLabel, priorityClasses, formatDate, isCardOverdue } from '@/lib/card-utils'
import type { CardListItem } from '@/types/card.types'

export function KanbanCardOverlay({ card }: { card: CardListItem }) {
  const overdue = isCardOverdue(card.due_date)

  return (
    <div className="w-[272px] rotate-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl">
      <div className="mb-2">
        <Badge variant="outline" className={`rounded-full text-xs ${priorityClasses[card.priority]}`}>
          {priorityLabel[card.priority]}
        </Badge>
      </div>

      <p className="line-clamp-2 text-sm font-medium text-zinc-800">{card.title}</p>

      {card.due_date && (
        <div className={`mt-3 flex items-center gap-1.5 border-t border-zinc-100 pt-2 text-xs ${overdue ? 'text-red-500' : 'text-zinc-500'}`}>
          <Clock className="h-3 w-3" />
          <span>{formatDate(card.due_date)}</span>
        </div>
      )}
    </div>
  )
}