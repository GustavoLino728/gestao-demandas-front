// src/app/(app)/boards/[boardId]/page.tsx
'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, KanbanSquare, Plus } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KanbanColumn } from '@/components/kanban/KanbanColumn'
import { KanbanCardOverlay } from '@/components/kanban/KanbanCardOverlay'
import { KanbanSkeleton } from '@/components/kanban/KanbanSkeleton'
import { CardDetailsDialog } from '@/components/boards/CardDetailsDialog'
import { useBoardDetail } from '@/hooks/boards/useBoardDetail'
import { useMoveCard } from '@/hooks/cards/useMoveCard'
import { useCreateList } from '@/hooks/lists/useCreateList'
import type { CardListItem } from '@/types/card.types'
import type { KanbanColumn as KanbanColumnType } from '@/types/list.types'


function cloneColumns(cols: KanbanColumnType[]): KanbanColumnType[] {
  return cols.map((col) => ({ ...col, cards: [...col.cards] }))
}

function getTargetColumn(
  overId: string,
  cols: KanbanColumnType[]
): KanbanColumnType | null {
  const byCard = cols.find((col) => col.cards.some((c) => c.id === overId))
  if (byCard) return byCard

  if (overId.startsWith('empty-')) {
    const colId = overId.replace('empty-', '')
    return cols.find((col) => col.id === colId) ?? null
  }

  return cols.find((col) => col.id === overId) ?? null
}

export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>
}) {
  const { boardId } = use(params)
  const { board, columns, isLoading, error } = useBoardDetail(boardId)

  const [localColumns, setLocalColumns] = useState<KanbanColumnType[] | null>(null)
  const [activeCard, setActiveCard] = useState<CardListItem | null>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [creatingList, setCreatingList] = useState(false)
  const [newListName, setNewListName] = useState('')

  const moveMutation = useMoveCard(boardId)
  const createListMutation = useCreateList(boardId)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const activeColumns = localColumns ?? columns

  function handleDragStart(event: DragStartEvent) {
    const base = localColumns ?? columns
    const card = base.flatMap((col) => col.cards).find((c) => c.id === event.active.id)
    setActiveCard(card ?? null)
    if (!localColumns) setLocalColumns(cloneColumns(columns))
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setLocalColumns((prev) => {
      const base = cloneColumns(prev ?? columns)

      const srcIdx = base.findIndex((col) =>
        col.cards.some((c) => c.id === active.id)
      )
      if (srcIdx === -1) return base

      const movingCard = base[srcIdx].cards.find((c) => c.id === active.id)
      if (!movingCard) return base

      const targetCol = getTargetColumn(String(over.id), base)
      if (!targetCol) return base

      const tgtIdx = base.findIndex((col) => col.id === targetCol.id)
      if (tgtIdx === -1) return base

      const overId = String(over.id)

      base[srcIdx].cards = base[srcIdx].cards.filter((c) => c.id !== active.id)

      const tgtCards = base[tgtIdx].cards.filter((c) => c.id !== active.id)

      let insertAt = tgtCards.findIndex((c) => c.id === overId)
      if (overId.startsWith('empty-')) insertAt = 0
      if (insertAt < 0) insertAt = tgtCards.length

      tgtCards.splice(insertAt, 0, {
        ...movingCard,
        list_id: targetCol.id,
        position: insertAt,
      })

      base[tgtIdx].cards = tgtCards.map((c, i) => ({ ...c, position: i }))
      base[srcIdx].cards = base[srcIdx].cards.map((c, i) => ({ ...c, position: i }))

      return base
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCard(null)

    const base = localColumns ?? columns

    if (!over) {
      setLocalColumns(null)
      return
    }

    const toCol = getTargetColumn(String(over.id), base)
    if (!toCol) {
      setLocalColumns(null)
      return
    }

    const movedCard = base.flatMap((col) => col.cards).find((c) => c.id === active.id)
    if (!movedCard) {
      setLocalColumns(null)
      return
    }

    const fromCol =
      columns.find((col) => col.cards.some((c) => c.id === active.id)) ?? toCol

    moveMutation.mutate(
      {
        cardId: String(active.id),
        payload: { list_id: toCol.id, position: movedCard.position },
        fromListId: fromCol.id,
        toListId: toCol.id,
      },
      {
        onSuccess: () => setLocalColumns(null),
        onError: () => setLocalColumns(null),
      }
    )
  }

  function handleOpenCard(cardId: string, listId: string) {
    setSelectedCardId(cardId)
    setSelectedListId(listId)
  }

  function handleCloseCard(open: boolean) {
    if (!open) {
      setSelectedCardId(null)
      setSelectedListId(null)
    }
  }

  function handleOpenCreateList() {
    setCreatingList(true)
    setNewListName('')
  }

  function handleCancelCreateList() {
    setCreatingList(false)
    setNewListName('')
  }

  async function handleCreateList() {
    const name = newListName.trim()
    if (!name) return

    await createListMutation.mutateAsync({
      payload: { name, position: activeColumns.length },
    })

    setNewListName('')
    setCreatingList(false)
  }

  return (
    <div className="flex h-screen flex-col bg-[#f7f7f8]">

      {/* ── Topbar ─────────────────────────────────────────── */}
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

          <Button
            type="button"
            onClick={handleOpenCreateList}
            className="h-9 rounded-xl bg-red-600 px-4 text-sm text-white hover:bg-red-700"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Nova lista
          </Button>
        </div>
      </div>

      {/* ── Banner de erro ─────────────────────────────────── */}
      {error && (
        <div className="mx-6 mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(error as Error).message}
        </div>
      )}

      {/* ── Área do Kanban ─────────────────────────────────── */}
      <div className="flex flex-1 gap-4 overflow-x-auto p-6">

        {/* Loading */}
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <KanbanSkeleton key={i} />
            ))}
          </>

        /* Empty state */
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

        /* Board com colunas */
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {/* Colunas */}
            {activeColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                boardId={boardId}
                column={column}
                onOpenCard={handleOpenCard}
              />
            ))}

            {/* Ghost do card arrastado */}
            <DragOverlay>
              {activeCard ? <KanbanCardOverlay card={activeCard} /> : null}
            </DragOverlay>

            {/* Criar nova lista inline */}
            {creatingList ? (
              <div className="h-fit min-w-[272px] rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
                <Input
                  autoFocus
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Digite o nome da lista..."
                  className="h-10 rounded-xl border-zinc-200 bg-white"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      await handleCreateList()
                    }
                    if (e.key === 'Escape') handleCancelCreateList()
                  }}
                  disabled={createListMutation.isPending}
                />
                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Enter para criar · Esc para cancelar</span>
                  <button
                    type="button"
                    onClick={handleCancelCreateList}
                    className="text-zinc-500 hover:text-zinc-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenCreateList}
                className="flex h-fit min-w-[272px] items-center gap-2 rounded-3xl border border-dashed border-zinc-300 bg-white/60 px-5 py-4 text-sm text-zinc-500 transition-colors hover:border-zinc-400 hover:bg-white hover:text-zinc-700"
              >
                <Plus className="h-4 w-4" />
                Adicionar lista
              </button>
            )}
          </DndContext>
        )}
      </div>

      {/* ── Dialog de detalhes do card ─────────────────────── */}
      <CardDetailsDialog
        boardId={boardId}
        cardId={selectedCardId}
        listId={selectedListId}
        open={!!selectedCardId}
        onOpenChange={handleCloseCard}
      />
    </div>
  )
}