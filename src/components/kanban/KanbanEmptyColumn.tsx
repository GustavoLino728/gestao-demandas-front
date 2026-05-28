'use client'

import { useSortable } from '@dnd-kit/sortable'

interface KanbanEmptyColumnProps {
  columnId: string
}

export function KanbanEmptyColumn({ columnId }: KanbanEmptyColumnProps) {
  const { setNodeRef, isOver } = useSortable({
    id: `empty-${columnId}`,
    data: { type: 'empty-column', columnId },
  })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border border-dashed py-6 text-center text-xs transition-colors ${
        isOver
          ? 'border-red-300 bg-red-50 text-red-500'
          : 'border-zinc-200 bg-transparent text-zinc-400'
      }`}
    >
      {isOver ? 'Soltar aqui' : 'Nenhum card'}
    </div>
  )
}