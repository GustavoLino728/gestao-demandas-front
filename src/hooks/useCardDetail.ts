'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getCardById } from '@/services/cards.service'

export function useCardDetail(cardId: string | null) {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['card-detail', cardId],
    queryFn: () => getCardById(cardId ?? '', session?.accessToken ?? ''),
    enabled: !!session?.accessToken && !!cardId,
  })
}