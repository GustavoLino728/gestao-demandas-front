'use client'

import { useQueries, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getBoards } from '@/services/boards.service'
import { getListsByBoard } from '@/services/lists.service'
import { getCardsByList } from '@/services/cards.service'
import { KanbanColumn } from '@/types/list.types'

export function useBoard(boardId: string) {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['boards', boardId],
    queryFn: async () => {
      const boards = await getBoards(session?.accessToken ?? '')
      const board = boards.find((b) => b.id === boardId)
      if (!board) throw new Error('Board não encontrado.')
      return board
    },
    enabled: !!session?.accessToken && !!boardId,
  })
}

export function useLists(boardId: string) {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['lists', boardId],
    queryFn: () => getListsByBoard(boardId, session?.accessToken ?? ''),
    enabled: !!session?.accessToken && !!boardId,
  })
}

export function useBoardDetail(boardId: string) {
  const { data: session } = useSession()

  const boardQuery = useBoard(boardId)
  const listsQuery = useLists(boardId)

  const lists = listsQuery.data ?? []

  const cardQueries = useQueries({
    queries: lists.map((list) => ({
      queryKey: ['cards', 'list', list.id],
      queryFn: () => getCardsByList(list.id, session?.accessToken ?? ''),
      enabled: !!session?.accessToken && lists.length > 0,
    })),
  })

  const isLoading =
    boardQuery.isLoading ||
    listsQuery.isLoading ||
    cardQueries.some((q) => q.isLoading)

  const error =
    boardQuery.error ||
    listsQuery.error ||
    cardQueries.find((q) => q.error)?.error

  const columns: KanbanColumn[] = lists
    .map((list, index) => ({
      ...list,
      cards: cardQueries[index]?.data ?? [],
    }))
    .sort((a, b) => a.position - b.position)

  return {
    board: boardQuery.data,
    columns,
    isLoading,
    error,
  }
}