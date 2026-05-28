'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { createList } from '@/services/lists.service'

export function useCreateList(boardId: string) {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: {
        name: string
        position: number
      }
    }) => createList(boardId, payload, token!),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['boards', boardId],
      })

      await queryClient.invalidateQueries({
        queryKey: ['lists', 'board', boardId],
      })

      await queryClient.refetchQueries({
        queryKey: ['boards', boardId],
      })

      await queryClient.refetchQueries({
        queryKey: ['lists', 'board', boardId],
      })
    },
  })
}