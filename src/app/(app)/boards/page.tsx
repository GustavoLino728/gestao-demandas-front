'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  LayoutGrid,
  Search,
  Filter,
  Plus,
  FolderKanban,
  KanbanSquare,
  ArrowUpRight
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useBoards } from '@/hooks/boards/useBoards'
import { BoardListItem, BoardStatus } from '@/types/board.types'
import { CreateBoardDialog } from '@/components/boards/CreateBoardDialog'
import { BoardCard } from '@/components/boards/BoardCard'

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

export default function BoardsPage() {
  const [openCreate, setOpenCreate] = useState(false)
  const [search, setSearch] = useState('')
  const { data: boards = [], isLoading, error } = useBoards()

  const filteredBoards = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return boards

    return boards.filter((board) => {
      return (
        board.name.toLowerCase().includes(query) ||
        board.description?.toLowerCase().includes(query) ||
        board.sector?.toLowerCase().includes(query)
      )
    })
  }, [boards, search])

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-zinc-500">
              <span>Boards</span>
              <span>•</span>
              <span>Gestão visual de demandas</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Visualização de Boards
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Acesse e acompanhe os boards disponíveis no sistema.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar board..."
                className="h-11 rounded-xl border-zinc-200 bg-white pl-9 shadow-none"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-zinc-200 bg-white px-4 text-zinc-700"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>

            <Button
              onClick={() => setOpenCreate(true)}
              className="h-11 rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              + Novo board
            </Button>

            <CreateBoardDialog
              open={openCreate}
              onOpenChange={setOpenCreate}
            />
    
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total de boards"
            value={boards.length}
            helper="Boards cadastrados"
            icon={<LayoutGrid className="h-4 w-4 text-blue-600" />}
          />
          <SummaryCard
            title="Boards ativos"
            value={boards.filter((board) => board.status === 'active').length}
            helper="Em operação"
            icon={<FolderKanban className="h-4 w-4 text-emerald-600" />}
          />
          <SummaryCard
            title="Cards totais"
            value={boards.reduce((acc, board) => acc + board.cards_count, 0)}
            helper="Demandas consolidadas"
            icon={<KanbanSquare className="h-4 w-4 text-amber-600" />}
          />
          <SummaryCard
            title="Colunas totais"
            value={boards.reduce((acc, board) => acc + board.columns_count, 0)}
            helper="Estrutura dos boards"
            icon={<ArrowUpRight className="h-4 w-4 text-zinc-600" />}
          />
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {(error as Error).message}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-24 rounded bg-zinc-200" />
                  <div className="h-6 w-3/4 rounded bg-zinc-200" />
                  <div className="h-4 w-full rounded bg-zinc-100" />
                  <div className="h-4 w-2/3 rounded bg-zinc-100" />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-16 rounded-2xl bg-zinc-100" />
                    <div className="h-16 rounded-2xl bg-zinc-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBoards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
              <LayoutGrid className="h-6 w-6 text-zinc-500" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Nenhum board encontrado
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Ajuste a busca ou crie um novo board para começar.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string
  value: number
  helper: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50">
        {icon}
      </div>
      <div className="text-3xl font-bold tracking-tight text-zinc-900">
        {value}
      </div>
      <p className="mt-1 text-sm font-medium text-zinc-700">{title}</p>
      <p className="text-xs text-zinc-500">{helper}</p>
    </div>
  )
}

function InfoMiniCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl bg-zinc-50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-zinc-900">
        {value}
      </p>
    </div>
  )
}

function formatDate(date: string) {
  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return '--'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed)
}