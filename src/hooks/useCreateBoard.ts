'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { createBoard } from '@/services/boards.service'
import type { CreateBoardPayload } from '@/types/board.types'

export function useCreateBoard() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: (payload: CreateBoardPayload) =>
      createBoard(payload, session?.accessToken ?? ''),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}