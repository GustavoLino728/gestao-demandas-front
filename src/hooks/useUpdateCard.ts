'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { updateCard } from '@/services/cards.service'
import type { CardUpdatePayload } from '@/types/card.types'

export function useUpdateCard(boardId: string, cardId: string, listId: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CardUpdatePayload) =>
      updateCard(cardId, payload, session?.accessToken ?? ''),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cards', 'list', listId] })
      await queryClient.invalidateQueries({ queryKey: ['card-detail', cardId] })
      await queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
    },
  })
}