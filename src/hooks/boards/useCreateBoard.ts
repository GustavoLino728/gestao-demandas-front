'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { createBoard } from '@/services/boards.service'
import { queryKeys } from '@/lib/query-keys'
import type { CreateBoardPayload } from '@/types/board.types'

export function useCreateBoard() {
  const token = useAccessToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBoardPayload) => createBoard(payload, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.all() })
    },
  })
}