'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { updateList } from '@/services/lists.service'
import { queryKeys } from '@/lib/query-keys'

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
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.byBoard(boardId) })
    },
  })
}