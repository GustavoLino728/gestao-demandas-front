'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { deleteBoard } from '@/services/boards.service'
import { queryKeys } from '@/lib/query-keys'

export function useDeleteBoard() {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (boardId: string) => deleteBoard(boardId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.all() })
    },
  })
}