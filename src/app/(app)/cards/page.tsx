'use client'

import { useMemo, useState } from 'react'
import {
  Search,
  Filter,
  Plus,
  KanbanSquare,
  AlertCircle,
  Clock,
  ArrowUpRight,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCards } from '@/hooks/useCards'
import { CardListItem, CardPriority } from '@/types/card.types'

// ─── Mapas de label e estilo (mesmo padrão de statusLabel/statusClasses) ──────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CardsPage() {
  const [search, setSearch] = useState('')
  const { data: cards = [], isLoading, error } = useCards()

  const filteredCards = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return cards
    return cards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query)
    )
  }, [cards, search])

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Cabeçalho da página */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-zinc-500">
              <span>Cards</span>
              <span>•</span>
              <span>Gestão de demandas</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Meus Cards
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Acompanhe todas as demandas atribuídas a você.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar card..."
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
              type="button"
              className="h-11 rounded-xl bg-red-600 px-4 text-white hover:bg-red-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo card
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6">

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total de cards"
            value={cards.length}
            helper="Cards atribuídos a você"
            icon={<KanbanSquare className="h-4 w-4 text-blue-600" />}
          />
          <SummaryCard
            title="Urgentes"
            value={cards.filter((c) => c.priority === 'urgent').length}
            helper="Requerem atenção imediata"
            icon={<AlertCircle className="h-4 w-4 text-red-600" />}
          />
          <SummaryCard
            title="Alta prioridade"
            value={cards.filter((c) => c.priority === 'high').length}
            helper="Prioridade alta"
            icon={<TriangleAlert className="h-4 w-4 text-amber-600" />}
          />
          <SummaryCard
            title="Com prazo"
            value={cards.filter((c) => c.due_date !== null).length}
            helper="Possuem data limite"
            icon={<Clock className="h-4 w-4 text-zinc-600" />}
          />
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {(error as Error).message}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-20 rounded bg-zinc-200" />
                  <div className="h-6 w-3/4 rounded bg-zinc-200" />
                  <div className="h-4 w-full rounded bg-zinc-100" />
                  <div className="h-4 w-2/3 rounded bg-zinc-100" />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-14 rounded-2xl bg-zinc-100" />
                    <div className="h-14 rounded-2xl bg-zinc-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        /* Empty state */
        ) : filteredCards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
              <KanbanSquare className="h-6 w-6 text-zinc-500" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Nenhum card encontrado
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              {search
                ? 'Nenhum card corresponde à sua busca.'
                : 'Você não possui cards atribuídos no momento.'}
            </p>
          </div>

        /* Grid de cards */
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components locais (mesmo padrão de boards/page.tsx) ──────────────────

function CardItem({ card }: { card: CardListItem }) {
  return (
    <div className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Topo: badge de prioridade + ícone de ação */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Badge
              variant="outline"
              className={`rounded-full ${priorityClasses[card.priority]}`}
            >
              {priorityLabel[card.priority]}
            </Badge>
          </div>
          <h2 className="truncate text-lg font-semibold text-zinc-900">
            {card.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
            {card.description || 'Sem descrição informada.'}
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-2 text-zinc-500 transition-colors group-hover:bg-red-50 group-hover:text-red-600">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* Info: posição e prazo */}
      <div className="grid grid-cols-2 gap-3">
        <InfoMiniCard label="Posição" value={card.position} />
        <InfoMiniCard
          label="Prazo"
          value={card.due_date ? formatDate(card.due_date) : '—'}
        />
      </div>

      {/* Rodapé */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs text-zinc-500">
        <span>Criado em {formatDate(card.created_at)}</span>
        <span>Atualizado em {formatDate(card.updated_at)}</span>
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
  value: number | string
}) {
  return (
    <div className="rounded-2xl bg-zinc-50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-xl font-semibold text-zinc-900">
        {value}
      </p>
    </div>
  )
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