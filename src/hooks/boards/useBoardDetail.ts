'use client'

import { useQueries, useQuery } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getBoards } from '@/services/boards.service'
import { getListsByBoard } from '@/services/lists.service'
import { getCardsByList } from '@/services/cards.service'
import { queryKeys } from '@/lib/query-keys'
import { KanbanColumn } from '@/types/list.types'

export function useBoard(boardId: string) {
  const token = useAccessToken()

  return useQuery({
    queryKey: queryKeys.boards.detail(boardId),
    queryFn: async () => {
      const boards = await getBoards(token!)
      const board = boards.find((b) => b.id === boardId)
      if (!board) throw new Error('Board não encontrado.')
      return board
    },
    enabled: !!token && !!boardId,
  })
}

export function useLists(boardId: string) {
  const token = useAccessToken()

  return useQuery({
    queryKey: queryKeys.lists.byBoard(boardId),
    queryFn:  () => getListsByBoard(boardId, token!),
    enabled:  !!token && !!boardId,
  })
}

export function useBoardDetail(boardId: string) {
  const token = useAccessToken()

  const boardQuery = useBoard(boardId)
  const listsQuery = useLists(boardId)
  const lists = listsQuery.data ?? []

  const cardQueries = useQueries({
    queries: lists.map((list) => ({
      queryKey: queryKeys.cards.byList(list.id),
      queryFn:  () => getCardsByList(list.id, token!),
      enabled:  !!token && lists.length > 0,
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

  return { board: boardQuery.data, columns, isLoading, error }
}