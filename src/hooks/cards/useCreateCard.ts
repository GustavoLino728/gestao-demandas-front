'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { createCard } from '@/services/cards.service'
import type { CardCreatePayload } from '@/types/card.types'

export function useCreateCard(boardId: string, listId: string) {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CardCreatePayload) => createCard(payload, token!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cards', 'list', listId] })
      await queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
    },
  })
}