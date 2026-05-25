'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { updateBoard, UpdateBoardPayload } from '@/services/boards.service'

export function useUpdateBoard() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: ({ boardId, payload }: { boardId: string; payload: UpdateBoardPayload }) =>
      updateBoard(boardId, payload, session?.accessToken ?? ''),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}