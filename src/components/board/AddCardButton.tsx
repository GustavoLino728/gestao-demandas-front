import { Button } from '@/components/ui/button'

interface AddCardButtonProps {
  onClick: () => void
}

export function AddCardButton({ onClick }: AddCardButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="h-11 w-full justify-start rounded-2xl border border-dashed border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
    >
      + Adicionar card
    </Button>
  )
}