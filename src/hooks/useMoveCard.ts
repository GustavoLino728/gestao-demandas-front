'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { moveCard } from '@/services/cards.service'
import type { CardMovePayload } from '@/types/card.types'

export function useMoveCard(boardId: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId: string
      payload: CardMovePayload
      fromListId: string
      toListId: string
    }) => moveCard(cardId, payload, session?.accessToken ?? ''),
    onSuccess: async (_, variables) => {
        await queryClient.invalidateQueries({
            queryKey: ['cards', 'list', variables.fromListId],
        })
        await queryClient.invalidateQueries({
            queryKey: ['cards', 'list', variables.toListId],
        })
        await queryClient.invalidateQueries({ queryKey: ['boards', boardId] })

        await queryClient.refetchQueries({
            queryKey: ['cards', 'list', variables.fromListId],
        })
        await queryClient.refetchQueries({
            queryKey: ['cards', 'list', variables.toListId],
        })
        },
  })
}