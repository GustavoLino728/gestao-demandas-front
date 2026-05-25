'use client'

import { useState } from 'react'
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
import { useCreateBoard } from '@/hooks/useCreateBoard'

interface CreateBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')

  const mutation = useCreateBoard()

  function handleClose() {
    setName('')
    setDescription('')
    setNameError('')
    onOpenChange(false)
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setNameError('O nome do board é obrigatório.')
      return
    }

    if (name.trim().length > 100) {
      setNameError('O nome deve ter no máximo 100 caracteres.')
      return
    }

    try {
      await mutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
      })
      handleClose()
    } catch (err) {
      setNameError((err as Error).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo board</DialogTitle>
          <DialogDescription>
            Crie um board para organizar as demandas do seu setor.
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
              placeholder="Ex.: Demandas do setor de TI"
              maxLength={100}
              className={`h-11 rounded-xl border-zinc-200 ${nameError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
            />
            {nameError && (
              <p className="text-xs text-red-600">{nameError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-800">
              Descrição{' '}
              <span className="text-xs font-normal text-zinc-400">(opcional)</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva brevemente o objetivo deste board..."
              maxLength={500}
              className="min-h-[100px] rounded-2xl border-zinc-200"
            />
            <p className="text-right text-xs text-zinc-400">
              {description.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending || !name.trim()}
            className="rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Criando...' : 'Criar board'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}