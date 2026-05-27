import { Button } from '@/components/ui/button'

interface AddListButtonProps {
  onClick: () => void
}

export function AddListButton({ onClick }: AddListButtonProps) {
  return (
    <div className="w-[320px] shrink-0">
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        className="h-12 w-full rounded-2xl border-dashed border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
      >
        + Nova lista
      </Button>
    </div>
  )
}