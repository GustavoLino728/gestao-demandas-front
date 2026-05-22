'use client'

import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BoardColumnActionsProps {
  onAddCard: () => void
  onEditList: () => void
  onDeleteList: () => void
}

export function BoardColumnActions({
  onAddCard,
  onEditList,
  onDeleteList,
}: BoardColumnActionsProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl border-zinc-200"
      >
        <DropdownMenuItem onSelect={onAddCard}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar card
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={onEditList}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar lista
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={onDeleteList}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir lista
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}