'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { updateBoard, UpdateBoardPayload } from '@/services/boards.service'

export function useUpdateBoard() {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ boardId, payload }: { boardId: string; payload: UpdateBoardPayload }) =>
      updateBoard(boardId, payload, token!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}