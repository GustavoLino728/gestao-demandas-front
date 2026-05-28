'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { updateCard } from '@/services/cards.service'
import type { CardUpdatePayload } from '@/types/card.types'
import { queryKeys } from '@/lib/query-keys'


export function useUpdateCard(boardId: string, cardId: string, listId: string) {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CardUpdatePayload) =>
      updateCard(cardId, payload, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.byList(listId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.detail(cardId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) })
    },
  })
}