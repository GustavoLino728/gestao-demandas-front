'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { createCard } from '@/services/cards.service'
import type { CardCreatePayload } from '@/types/card.types'

export function useCreateCard(boardId: string, listId: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CardCreatePayload) =>
      createCard(payload, session?.accessToken ?? ''),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cards', 'list', listId] })
      await queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
    },
  })
}