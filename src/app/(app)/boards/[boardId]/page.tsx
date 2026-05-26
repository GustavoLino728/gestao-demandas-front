'use client'

import { use, useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  KanbanSquare,
  Plus,
  MoreHorizontal,
  Clock,
  AlertCircle,
} from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useBoardDetail } from '@/hooks/useBoardDetail'
import { useCreateCard } from '@/hooks/useCreateCard'
import { useMoveCard } from '@/hooks/useMoveCard'
import { CardDetailsDialog } from '@/components/boards/CardDetailsDialog'
import type { CardListItem, CardPriority } from '@/types/card.types'
import type { KanbanColumn } from '@/types/list.types'


const priorityLabel: Record<CardPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
}

const priorityClasses: Record<CardPriority, string> = {
  low: 'border-zinc-200 bg-zinc-50 text-zinc-600',
  medium: 'border-blue-200 bg-blue-50 text-blue-700',
  high: 'border-amber-200 bg-amber-50 text-amber-700',
  urgent: 'border-red-200 bg-red-50 text-red-700',
}


export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>
}) {
  const { boardId } = use(params)
  const { board, columns, isLoading, error } = useBoardDetail(boardId)

  const [localColumns, setLocalColumns] = useState<KanbanColumn[] | null>(null)

  const activeColumns = localColumns ?? columns

  const [activeCard, setActiveCard] = useState<CardListItem | null>(null)

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [dragOriginColumnId, setDragOriginColumnId] = useState<string | null>(null)

  const moveMutation = useMoveCard(boardId)


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  function findColumn(cardId: string) {
    return syncedColumns.find((col) =>
      col.cards.some((c) => c.id === cardId)
    )
  }

  function handleDragStart(event: DragStartEvent) {
    const card = localColumns
      .flatMap((col) => col.cards)
      .find((c) => c.id === event.active.id)

    setActiveCard(card ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const sourceColumnIndex = localColumns.findIndex((col) =>
      col.cards.some((card) => card.id === active.id)
    )
    if (sourceColumnIndex === -1) return

    const targetColumn = getTargetColumn(String(over.id), localColumns)
    if (!targetColumn) return

    const targetColumnIndex = localColumns.findIndex(
      (col) => col.id === targetColumn.id
    )
    if (targetColumnIndex === -1) return

    const sourceColumn = localColumns[sourceColumnIndex]
    const movingCard = sourceColumn.cards.find((card) => card.id === active.id)
    if (!movingCard) return

    if (sourceColumn.id === targetColumn.id) return

    setLocalColumns((prev) => {
      const next = prev.map((col) => ({
        ...col,
        cards: [...col.cards],
      }))

      next[sourceColumnIndex].cards = next[sourceColumnIndex].cards.filter(
        (card) => card.id !== active.id
      )

      const alreadyExists = next[targetColumnIndex].cards.some(
        (card) => card.id === active.id
      )

      if (!alreadyExists) {
        next[targetColumnIndex].cards.push({
          ...movingCard,
          list_id: targetColumn.id,
        })
      }

      return next
    })
  }

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event
  setActiveCard(null)

  if (!over) {
    setLocalColumns(columns)
    return
  }

  const fromCol = localColumns.find((col) =>
    col.cards.some((c) => c.id === active.id)
  )

  if (!fromCol) {
    setLocalColumns(columns)
    return
  }

  const toCol = getTargetColumn(String(over.id), localColumns) ?? fromCol

  const targetCards = toCol.cards
    .filter((c) => c.id !== active.id)
    .sort((a, b) => a.position - b.position)

  let newPosition = targetCards.findIndex((c) => c.id === over.id)

  if (String(over.id).startsWith('empty-')) {
    newPosition = 0
  }

  if (newPosition < 0) {
    newPosition = targetCards.length
  }

  moveMutation.mutate(
    {
      cardId: String(active.id),
      payload: {
        list_id: toCol.id,
        position: newPosition,
      },
      fromListId: fromCol.id,
      toListId: toCol.id,
    },
    {
      onSuccess: () => {
      },
      onError: () => {
        setLocalColumns(columns)
      },
    }
  )
}
  function handleOpenCard(cardId: string, listId: string) {
    setSelectedCardId(cardId)
    setSelectedListId(listId)
  }

  return (
    <div className="flex h-screen flex-col bg-[#f7f7f8]">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/boards"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="mb-0.5 flex items-center gap-2 text-xs text-zinc-500">
                <Link href="/boards" className="hover:text-zinc-700">
                  Boards
                </Link>
                <span>/</span>
                <span>{board?.name ?? '...'}</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900">
                {isLoading ? (
                  <span className="inline-block h-5 w-40 animate-pulse rounded bg-zinc-200" />
                ) : (
                  board?.name ?? 'Board'
                )}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="h-9 rounded-xl bg-red-600 px-4 text-sm text-white hover:bg-red-700"
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              Nova lista
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(error as Error).message}
        </div>
      )}

      {/* Kanban */}
      <div className="flex flex-1 gap-4 overflow-x-auto p-6">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <ColumnSkeleton key={i} />
            ))}
          </>
        ) : activeColumns.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white py-20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
              <KanbanSquare className="h-6 w-6 text-zinc-500" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Nenhuma lista criada
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Crie uma lista para começar a organizar as demandas.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {activeColumns.map((column) => (
              <KanbanColumnComponent
                key={column.id}
                boardId={boardId}
                column={column}
                onOpenCard={handleOpenCard}
              />
            ))}

            {/* Overlay do card sendo arrastado */}
            <DragOverlay>
              {activeCard ? (
                <KanbanCardOverlay card={activeCard} />
              ) : null}
            </DragOverlay>

            <button
              type="button"
              className="flex h-fit min-w-[272px] items-center gap-2 rounded-3xl border border-dashed border-zinc-300 bg-white/60 px-5 py-4 text-sm text-zinc-500 transition-colors hover:border-zinc-400 hover:bg-white hover:text-zinc-700"
            >
              <Plus className="h-4 w-4" />
              Adicionar lista
            </button>
          </DndContext>
        )}
      </div>

      <CardDetailsDialog
        boardId={boardId}
        cardId={selectedCardId}
        listId={selectedListId}
        open={!!selectedCardId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCardId(null)
            setSelectedListId(null)
          }
        }}
      />
    </div>
  )
}


function KanbanColumnComponent({
  boardId,
  column,
  onOpenCard,
}: {
  boardId: string
  column: KanbanColumn
  onOpenCard: (cardId: string, listId: string) => void
}) {
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const mutation = useCreateCard(boardId, column.id)

  const sortedCards = column.cards
    .slice()
    .sort((a, b) => a.position - b.position)

  async function handleCreateCard() {
    if (!title.trim()) return
    await mutation.mutateAsync({
      title: title.trim(),
      list_id: column.id,
      description: null,
      priority: 'medium',
      due_date: null,
      assignee_id: null,
    })
    setTitle('')
    setCreating(false)
  }

  return (
    <SortableContext
      items={sortedCards.map((c) => c.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="flex h-fit min-w-[272px] max-w-[272px] flex-col rounded-3xl border border-zinc-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-800">
              {column.name}
            </span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-100 px-1.5 text-xs font-medium text-zinc-500">
              {column.cards.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-2 px-3 pb-3">
          {sortedCards.length === 0 && !creating ? (
            <DroppableEmptyColumn columnId={column.id} />
          ) : (
            sortedCards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                onClick={() => onOpenCard(card.id, column.id)}
              />
            ))
          )}

          {creating && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-2">
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do card..."
                className="h-10 rounded-xl border-zinc-200 bg-white"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    await handleCreateCard()
                  }
                  if (e.key === 'Escape') {
                    setCreating(false)
                    setTitle('')
                  }
                }}
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Enter para criar · Esc para cancelar</span>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false)
                    setTitle('')
                  }}
                  className="text-zinc-500 hover:text-zinc-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SortableContext>
  )
}

function DroppableEmptyColumn({ columnId }: { columnId: string }) {
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

function SortableCard({
  card,
  onClick,
}: {
  card: CardListItem
  onClick: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  const isOverdue =
    card.due_date !== null && new Date(card.due_date) < new Date()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (!isDragging) onClick()
      }}
      className="group w-full rounded-2xl border border-zinc-100 bg-white p-3 text-left shadow-sm transition-shadow hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <Badge
          variant="outline"
          className={`rounded-full text-xs ${priorityClasses[card.priority]}`}
        >
          {priorityLabel[card.priority]}
        </Badge>
      </div>

      <p className="line-clamp-2 text-sm font-medium text-zinc-800">
        {card.title}
      </p>

      {card.description && (
        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
          {card.description}
        </p>
      )}

      {card.due_date && (
        <div
          className={`mt-3 flex items-center gap-1.5 border-t border-zinc-100 pt-2 text-xs ${
            isOverdue ? 'text-red-500' : 'text-zinc-500'
          }`}
        >
          <Clock className="h-3 w-3" />
          <span>{formatDate(card.due_date)}</span>
          {isOverdue && <AlertCircle className="ml-auto h-3 w-3" />}
        </div>
      )}
    </div>
  )
}


function KanbanCardOverlay({ card }: { card: CardListItem }) {
  const isOverdue =
    card.due_date !== null && new Date(card.due_date) < new Date()

  return (
    <div className="w-[272px] rotate-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl">
      <div className="mb-2">
        <Badge
          variant="outline"
          className={`rounded-full text-xs ${priorityClasses[card.priority]}`}
        >
          {priorityLabel[card.priority]}
        </Badge>
      </div>
      <p className="line-clamp-2 text-sm font-medium text-zinc-800">
        {card.title}
      </p>
      {card.due_date && (
        <div
          className={`mt-3 flex items-center gap-1.5 border-t border-zinc-100 pt-2 text-xs ${
            isOverdue ? 'text-red-500' : 'text-zinc-500'
          }`}
        >
          <Clock className="h-3 w-3" />
          <span>{formatDate(card.due_date)}</span>
        </div>
      )}
    </div>
  )
}


function ColumnSkeleton() {
  return (
    <div className="flex h-fit min-w-[272px] max-w-[272px] flex-col rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="px-4 py-3">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-28 rounded bg-zinc-200" />
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 pb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-zinc-100 bg-white p-3"
          >
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-zinc-200" />
              <div className="h-4 w-full rounded bg-zinc-200" />
              <div className="h-4 w-3/4 rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getTargetColumn(overId: string, columns: KanbanColumn[]) {
  const columnByCard = columns.find((col) =>
    col.cards.some((card) => card.id === overId)
  )
  if (columnByCard) return columnByCard

  if (overId.startsWith('empty-')) {
    const columnId = overId.replace('empty-', '')
    return columns.find((col) => col.id === columnId) ?? null
  }

  return columns.find((col) => col.id === overId) ?? null
}

function formatDate(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return '--'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed)
}