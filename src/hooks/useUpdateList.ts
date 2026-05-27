'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { updateList } from '@/services/lists.service'

export function useUpdateList(boardId: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      listId,
      payload,
    }: {
      listId: string
      payload: { name: string }
    }) => updateList(boardId, listId, payload, session?.accessToken ?? ''),

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