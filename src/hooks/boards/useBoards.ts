'use client'

import { useQuery } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getBoards } from '@/services/boards.service'
import { queryKeys } from '@/lib/query-keys'

export function useBoards() {
  const token = useAccessToken()

  return useQuery({
    queryKey: queryKeys.boards.all(),
    queryFn:  () => getBoards(token!),
    enabled:  !!token,
  })
}