'use client'

import { useState } from 'react'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { KanbanCard } from './KanbanCard'
import { KanbanEmptyColumn } from './KanbanEmptyColumn'
import { useCreateCard } from '@/hooks/cards/useCreateCard'
import { useUpdateList } from '@/hooks/lists/useUpdateList'
import { useDeleteList } from '@/hooks/lists/useDeleteList'
import type { KanbanColumn as KanbanColumnType } from '@/types/list.types'

interface KanbanColumnProps {
  boardId: string
  column: KanbanColumnType
  onOpenCard: (cardId: string, listId: string) => void
}

export function KanbanColumn({ boardId, column, onOpenCard }: KanbanColumnProps) {
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [listName, setListName] = useState(column.name)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const createCardMutation = useCreateCard(boardId, column.id)
  const updateListMutation = useUpdateList(boardId)
  const deleteListMutation = useDeleteList(boardId)

  const sortedCards = column.cards.slice().sort((a, b) => a.position - b.position)

  async function handleCreateCard() {
    if (!title.trim()) return
    await createCardMutation.mutateAsync({
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

  async function handleRenameList() {
    const nextName = listName.trim()
    if (!nextName) {
      setListName(column.name)
      setEditingName(false)
      return
    }
    if (nextName === column.name) {
      setEditingName(false)
      return
    }
    try {
      await updateListMutation.mutateAsync({
        listId: column.id,
        payload: { name: nextName },
      })
      setEditingName(false)
    } catch {
      setListName(column.name)
      setEditingName(false)
    }
  }

  async function handleDeleteList() {
    try {
      await deleteListMutation.mutateAsync({ listId: column.id })
      setDeleteOpen(false)
    } catch {
      setDeleteOpen(false)
    }
  }

  return (
    <SortableContext
      items={sortedCards.map((c) => c.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="flex h-fit min-w-[272px] max-w-[272px] flex-col rounded-3xl border border-zinc-200 bg-white shadow-sm">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {editingName ? (
              <Input
                autoFocus
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="h-8 rounded-lg border-zinc-200 bg-white text-sm font-semibold text-zinc-800"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') { e.preventDefault(); await handleRenameList() }
                  if (e.key === 'Escape') { setListName(column.name); setEditingName(false) }
                }}
                onBlur={async () => { if (editingName) await handleRenameList() }}
                disabled={updateListMutation.isPending}
              />
            ) : (
              <span className="truncate text-sm font-semibold text-zinc-800">
                {column.name}
              </span>
            )}

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuItem
                  onClick={() => { setListName(column.name); setEditingName(true) }}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar lista
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar lista
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── Cards ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 px-3 pb-3">
          {sortedCards.length === 0 && !creating ? (
            <KanbanEmptyColumn columnId={column.id} />
          ) : (
            sortedCards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onClick={() => onOpenCard(card.id, column.id)}
              />
            ))
          )}

          {/* ── Inline card creation ────────────────────────── */}
          {creating && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-2">
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do card..."
                className="h-10 rounded-xl border-zinc-200 bg-white"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') { e.preventDefault(); await handleCreateCard() }
                  if (e.key === 'Escape') { setCreating(false); setTitle('') }
                }}
                disabled={createCardMutation.isPending}
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Enter para criar · Esc para cancelar</span>
                <button
                  type="button"
                  onClick={() => { setCreating(false); setTitle('') }}
                  className="text-zinc-500 hover:text-zinc-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Delete confirmation dialog ──────────────────────── */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Deletar lista</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar a lista &quot;{column.name}&quot;? Essa
                ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteListMutation.isPending}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async (e) => { e.preventDefault(); await handleDeleteList() }}
                disabled={deleteListMutation.isPending}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {deleteListMutation.isPending ? 'Deletando...' : 'Deletar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SortableContext>
  )
}