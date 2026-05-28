'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[GlobalError]', error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f7f7f8] px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-zinc-900">Erro inesperado</h1>
        <p className="mt-2 text-sm text-zinc-500">
          O sistema encontrou um erro crítico. Tente recarregar a página.
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Tentar novamente
      </Button>
    </div>
  )
}