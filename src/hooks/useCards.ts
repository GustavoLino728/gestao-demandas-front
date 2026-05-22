'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import {
  getMyCards,
  getCardsByList,
  createCard,
  updateCard,
  moveCard,
  deleteCard,
} from '@/services/cards.service'
import type {
  CardCreatePayload,
  CardUpdatePayload,
  CardMovePayload,
} from '@/types/card.types'

// Hook espelho de useBoards — lista cards do usuário autenticado
export function useCards() {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['cards'],
    queryFn: () => getMyCards(session?.accessToken ?? ''),
    enabled: !!session?.accessToken,
  })
}

// Hook para cards de uma lista específica
export function useCardsByList(listId: string) {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['cards', 'list', listId],
    queryFn: () => getCardsByList(listId, session?.accessToken ?? ''),
    enabled: !!session?.accessToken && !!listId,
  })
}

// Mutations
export function useCreateCard() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CardCreatePayload) =>
      createCard(payload, session?.accessToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}

export function useUpdateCard(cardId: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CardUpdatePayload) =>
      updateCard(cardId, payload, session?.accessToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}

export function useMoveCard() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: CardMovePayload }) =>
      moveCard(cardId, payload, session?.accessToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}

export function useDeleteCard() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cardId: string) =>
      deleteCard(cardId, session?.accessToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}