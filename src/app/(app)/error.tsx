// src/app/(app)/error.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api-client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AppError]', error)
    }
  }, [error])

  const isApiError = error instanceof ApiError
  const isNotFound = isApiError && error.statusCode === 404
  const isUnauthorized = isApiError && error.statusCode === 401

  if (isUnauthorized) {
    router.push('/login?error=SessionExpired')
    return null
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-zinc-900">
          {isNotFound ? 'Recurso não encontrado' : 'Algo deu errado'}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          {isNotFound
            ? 'O item que você tentou acessar não existe ou foi removido.'
            : 'Ocorreu um erro ao carregar esta página. Tente novamente.'}
        </p>

        {/* Detalhes técnicos apenas em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <p className="mt-3 rounded-xl bg-zinc-100 px-4 py-2 font-mono text-xs text-zinc-600">
            {error.message}
            {error.digest && ` (digest: ${error.digest})`}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl border-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button
          onClick={reset}
          className="rounded-xl bg-red-600 text-white hover:bg-red-700"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}