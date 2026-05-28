'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { queryKeys } from '@/lib/query-keys'
import {
  getMyCards, getCardsByList, createCard,
  updateCard, moveCard, deleteCard,
} from '@/services/cards.service'
import type { CardCreatePayload, CardUpdatePayload, CardMovePayload } from '@/types/card.types'

export function useCards() {
  const token = useAccessToken()
  return useQuery({
    queryKey: queryKeys.cards.all(),
    queryFn:  () => getMyCards(token!),
    enabled:  !!token,
  })
}

export function useCardsByList(listId: string) {
  const token = useAccessToken()
  return useQuery({
    queryKey: queryKeys.cards.byList(listId),
    queryFn:  () => getCardsByList(listId, token!),
    enabled:  !!token && !!listId,
  })
}

export function useCreateCard() {
  const token = useAccessToken()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CardCreatePayload) => createCard(payload, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all() }) // ✅
    },
  })
}

export function useUpdateCard(cardId: string) {
  const token = useAccessToken()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CardUpdatePayload) => updateCard(cardId, payload, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all() }) // ✅
    },
  })
}

export function useMoveCard() {
  const token = useAccessToken()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: CardMovePayload }) =>
      moveCard(cardId, payload, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all() }) // ✅
    },
  })
}

export function useDeleteCard() {
  const token = useAccessToken()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all() }) // ✅
    },
  })
}