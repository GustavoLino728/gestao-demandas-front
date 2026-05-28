'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { deleteList } from '@/services/lists.service'
import { queryKeys } from '@/lib/query-keys'

export function useDeleteList(boardId: string) {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId }: { listId: string }) =>
      deleteList(boardId, listId, token!),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.byBoard(boardId) })
  },
  })
}