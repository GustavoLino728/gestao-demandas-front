'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { deleteList } from '@/services/lists.service'

export function useDeleteList(boardId: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId }: { listId: string }) =>
      deleteList(boardId, listId, session?.accessToken ?? ''),

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