'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getBoards } from '@/services/boards.service'

export function useBoards() {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['boards'],
    queryFn: () => getBoards(session?.accessToken ?? ''),
    enabled: !!session?.accessToken,
  })
}