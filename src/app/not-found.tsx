import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f7f7f8] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
        <FileQuestion className="h-8 w-8 text-zinc-500" />
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-400">Erro 404</p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900">
          Página não encontrada
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          A página que você tentou acessar não existe.
        </p>
      </div>

      <Button asChild className="rounded-xl bg-red-600 text-white hover:bg-red-700">
        <Link href="/boards">Ir para Boards</Link>
      </Button>
    </div>
  )
}