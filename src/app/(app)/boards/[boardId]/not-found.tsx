import Link from 'next/link'
import { KanbanSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BoardNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
        <KanbanSquare className="h-8 w-8 text-zinc-500" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Board não encontrado</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Este board não existe ou foi removido.
        </p>
      </div>
      <Button asChild className="rounded-xl bg-red-600 text-white hover:bg-red-700">
        <Link href="/boards">Voltar para Boards</Link>
      </Button>
    </div>
  )
}