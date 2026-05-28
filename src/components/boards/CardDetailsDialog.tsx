'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clock, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useCardDetail } from '@/hooks/cards/useCardDetail'
import { useUpdateCard } from '@/hooks/cards/useUpdateCard'
import type { CardPriority } from '@/types/card.types'

interface CardDetailsDialogProps {
  boardId: string
  cardId: string | null
  listId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const priorityOptions: Array<{ value: CardPriority; label: string }> = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
]

export function CardDetailsDialog({
  boardId,
  cardId,
  listId,
  open,
  onOpenChange,
}: CardDetailsDialogProps) {
  const { data, isLoading } = useCardDetail(cardId)
  const mutation = useUpdateCard(boardId, cardId ?? '', listId ?? '')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<CardPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [assigneeId, setAssigneeId] = useState('')

  useEffect(() => {
    if (!data) return
    setTitle(data.title ?? '')
    setDescription(data.description ?? '')
    setPriority(data.priority ?? 'medium')
    setDueDate(data.due_date ? toDatetimeLocal(data.due_date) : '')
    setAssigneeId(data.assignee_id ?? '')
  }, [data])

  const history = useMemo(() => data?.history ?? [], [data?.history])

  async function handleSave() {
    if (!cardId || !listId || !title.trim()) return

    await mutation.mutateAsync({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      assignee_id: assigneeId.trim() || null,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do card</DialogTitle>
          <DialogDescription>
            Visualize, edite e acompanhe o histórico de alterações.
          </DialogDescription>
        </DialogHeader>

        {isLoading || !data ? (
          <div className="space-y-3 py-4">
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
            <div className="h-24 animate-pulse rounded bg-zinc-100" />
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">Título</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título do card"
                  className="h-11 rounded-xl border-zinc-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">Descrição</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a demanda..."
                  className="min-h-[140px] rounded-2xl border-zinc-200"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-800">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as CardPriority)}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-800">Data limite</label>
                  <Input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-11 rounded-xl border-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">Assignee ID</label>
                <Input
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  placeholder="UUID do responsável"
                  className="h-11 rounded-xl border-zinc-200"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50/60 p-4">
              <div className="mb-4 flex items-center gap-2">
                <History className="h-4 w-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900">Histórico</h3>
              </div>

              {history.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
                  Nenhuma alteração registrada.
                </div>
              ) : (
                <div className="space-y-3">
                  {history
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
                    )
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-zinc-200 bg-white p-3"
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            {entry.field_changed}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-zinc-400">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(entry.changed_at)}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-500">
                          <span className="font-medium text-zinc-700">De:</span>{' '}
                          {entry.old_value || '—'}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          <span className="font-medium text-zinc-700">Para:</span>{' '}
                          {entry.new_value || '—'}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Fechar
          </Button>
          <Button
            onClick={handleSave}
            disabled={mutation.isPending || !title.trim() || !cardId || !listId}
            className="rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function toDatetimeLocal(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}