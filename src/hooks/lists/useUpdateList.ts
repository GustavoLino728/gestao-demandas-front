'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { updateList } from '@/services/lists.service'

export function useUpdateList(boardId: string) {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      listId,
      payload,
    }: {
      listId: string
      payload: { name: string }
    }) => updateList(boardId, listId, payload, token!),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
      await queryClient.invalidateQueries({ queryKey: ['lists', 'board', boardId] })
    },
  })
}