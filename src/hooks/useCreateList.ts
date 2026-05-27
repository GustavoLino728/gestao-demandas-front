'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { createList } from '@/services/lists.service'

export function useCreateList(boardId: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: {
        name: string
        position: number
      }
    }) => createList(boardId, payload, session?.accessToken ?? ''),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['boards', boardId],
      })

      await queryClient.invalidateQueries({
        queryKey: ['lists', 'board', boardId],
      })

      await queryClient.refetchQueries({
        queryKey: ['boards', boardId],
      })

      await queryClient.refetchQueries({
        queryKey: ['lists', 'board', boardId],
      })
    },
  })
}