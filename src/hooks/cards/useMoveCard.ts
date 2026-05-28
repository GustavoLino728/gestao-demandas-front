'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { moveCard } from '@/services/cards.service'
import type { CardMovePayload } from '@/types/card.types'

export function useMoveCard(boardId: string) {
  const token       = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId:       string
      payload:      CardMovePayload
      fromListId:   string
      toListId:     string
    }) => moveCard(cardId, payload, token!),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', 'list', variables.fromListId] })
      queryClient.invalidateQueries({ queryKey: ['cards', 'list', variables.toListId] })
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
    },
  })
}