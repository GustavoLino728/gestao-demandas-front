'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useDeleteBoard } from '@/hooks/boards/useDeleteBoard'
import { useUpdateBoard } from '@/hooks/boards/useUpdateBoard'
import { BoardListItem, BoardStatus } from '@/types/board.types'

const statusLabel: Record<BoardStatus, string> = {
  active: 'Ativo',
  archived: 'Arquivado',
  draft: 'Rascunho',
}

const statusClasses: Record<BoardStatus, string> = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  archived: 'border-zinc-200 bg-zinc-100 text-zinc-700',
  draft: 'border-amber-200 bg-amber-50 text-amber-700',
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

interface BoardCardProps {
  board: BoardListItem
}

export function BoardCard({ board }: BoardCardProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [name, setName] = useState(board.name)
  const [description, setDescription] = useState(board.description ?? '')
  const [nameError, setNameError] = useState('')

  const deleteMutation = useDeleteBoard()
  const updateMutation = useUpdateBoard()

  async function handleDelete() {
    await deleteMutation.mutateAsync(board.id)
    setOpenDelete(false)
  }

  async function handleUpdate() {
    if (!name.trim()) {
      setNameError('O nome do board é obrigatório.')
      return
    }
    try {
      await updateMutation.mutateAsync({
        boardId: board.id,
        payload: {
          name: name.trim(),
          description: description.trim() || null,
        },
      })
      setOpenEdit(false)
      setNameError('')
    } catch (err) {
      setNameError((err as Error).message)
    }
  }

  function handleOpenEdit() {
    setName(board.name)
    setDescription(board.description ?? '')
    setNameError('')
    setOpenEdit(true)
  }

  return (
    <>
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        {/* Header: badge, setor e menu */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className={`rounded-full ${statusClasses[board.status]}`}
              >
                {statusLabel[board.status]}
              </Badge>

              {board.sector && (
                <span className="truncate text-xs font-medium text-zinc-500">
                  {board.sector}
                </span>
              )}
            </div>
          </div>

          {/* Três pontos — fora do Link */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-zinc-200">
              <DropdownMenuItem onSelect={handleOpenEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar board
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => setOpenDelete(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Corpo clicável para navegar */}
        <Link href={`/boards/${board.id}`} className="block">
          <h2 className="truncate text-lg font-semibold text-zinc-900 hover:text-red-600 transition-colors">
            {board.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
            {board.description || 'Sem descrição informada.'}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Colunas</p>
              <p className="mt-1 text-xl font-semibold text-zinc-900">{board.columns_count}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Cards</p>
              <p className="mt-1 text-xl font-semibold text-zinc-900">{board.cards_count}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs text-zinc-500">
            <span>Criado em {formatDate(board.created_at)}</span>
            <span>Atualizado em {formatDate(board.updated_at)}</span>
          </div>
        </Link>
      </div>

      {/* Dialog de edição */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar board</DialogTitle>
            <DialogDescription>
              Atualize as informações do board.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-800">
                Nome <span className="text-red-600">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (nameError) setNameError('')
                }}
                maxLength={100}
                className={`h-11 rounded-xl border-zinc-200 ${nameError ? 'border-red-400' : ''}`}
              />
              {nameError && <p className="text-xs text-red-600">{nameError}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-800">
                Descrição{' '}
                <span className="text-xs font-normal text-zinc-400">(opcional)</span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                className="min-h-[100px] rounded-2xl border-zinc-200"
              />
              <p className="text-right text-xs text-zinc-400">{description.length}/500</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending || !name.trim()}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de exclusão */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir board</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O board{' '}
              <strong>"{board.name}"</strong> e todos os dados vinculados serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir board'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}