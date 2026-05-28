'use client'

import { useQuery } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getCardById } from '@/services/cards.service'

export function useCardDetail(cardId: string | null) {
  const token = useAccessToken()

  return useQuery({
    queryKey: ['card-detail', cardId],
    queryFn: () => getCardById(cardId!, token!),
    enabled: !!token && !!cardId,
  })
}