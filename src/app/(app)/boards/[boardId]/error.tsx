'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { KanbanSquare, ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api-client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BoardError({ error, reset }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[BoardError]', error)
    }
  }, [error])

  const isNotFound = error instanceof ApiError && error.statusCode === 404

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
        <KanbanSquare className="h-8 w-8 text-amber-500" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-zinc-900">
          {isNotFound ? 'Board não encontrado' : 'Erro ao carregar o board'}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          {isNotFound
            ? 'Este board não existe ou você não tem permissão para acessá-lo.'
            : 'Não foi possível carregar as informações deste board.'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <p className="mt-3 rounded-xl bg-zinc-100 px-4 py-2 font-mono text-xs text-zinc-600">
            {error.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.push('/boards')}
          className="rounded-xl border-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Boards
        </Button>

        {/* Só mostra "Tentar novamente" se não for 404 — 
            tentar de novo um 404 não resolve nada */}
        {!isNotFound && (
          <Button
            onClick={reset}
            className="rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  )
}