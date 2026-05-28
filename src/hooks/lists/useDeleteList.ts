'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { deleteList } from '@/services/lists.service'

export function useDeleteList(boardId: string) {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId }: { listId: string }) =>
      deleteList(boardId, listId, token!),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
      await queryClient.invalidateQueries({ queryKey: ['lists', 'board', boardId] })
    },
  })
}