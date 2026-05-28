'use client'

import { useQuery } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getBoards } from '@/services/boards.service'

export function useBoards() {
  const token = useAccessToken()

  return useQuery({
    queryKey: ['boards'],
    queryFn:  () => getBoards(token!),
    enabled:  !!token,
  })
}