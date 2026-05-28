'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { deleteBoard } from '@/services/boards.service'

export function useDeleteBoard() {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (boardId: string) => deleteBoard(boardId, token!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}