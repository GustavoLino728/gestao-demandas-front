'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { createList } from '@/services/lists.service'
import { queryKeys } from '@/lib/query-keys'

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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.byBoard(boardId) })
    },
  })
}