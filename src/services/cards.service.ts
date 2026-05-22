import { 
  CardApiItem,
  CardDetailApiItem,
  CardListItem,
  CardCreatePayload,
  CardUpdatePayload,
  CardMovePayload,
} from '@/types/card.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')

// A API retorna CardResponse com campos garantidos — normalize é simples
function normalizeCard(card: CardApiItem): CardListItem {
  return {
    id: card.id,
    title: card.title ?? 'Card sem título',
    description: card.description ?? null,
    priority: card.priority ?? 'medium',
    position: card.position ?? 0,
    due_date: card.due_date ?? null,
    list_id: card.list_id ?? '',
    assignee_id: card.assignee_id ?? null,
    created_at: card.created_at ?? new Date().toISOString(),
    updated_at: card.updated_at ?? new Date().toISOString(),
  }
}

async function apiFetch<T>(
  path: string,
  accessToken: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
    cache: 'no-store',
  })

  // DELETE retorna 204 sem body
  if (response.status === 204) return undefined as T

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      result?.detail ||
      result?.message ||
      'Erro na requisição.'
    )
  }

  return result as T
}

// GET /cards/me — retorna list[CardResponse] (array direto)
export async function getMyCards(accessToken: string): Promise<CardListItem[]> {
  const data = await apiFetch<CardApiItem[]>('/cards/me', accessToken)
  return data.map(normalizeCard)
}

// GET /cards/list/{list_id} — retorna list[CardResponse] (array direto)
export async function getCardsByList(
  listId: string,
  accessToken: string
): Promise<CardListItem[]> {
  const data = await apiFetch<CardApiItem[]>(`/cards/list/${listId}`, accessToken)
  return data.map(normalizeCard)
}

// GET /cards/{card_id} — retorna CardDetailResponse (com history)
export async function getCardById(
  cardId: string,
  accessToken: string
): Promise<CardDetailApiItem> {
  return apiFetch<CardDetailApiItem>(`/cards/${cardId}`, accessToken)
}

// POST /cards/ — status 201, retorna CardResponse
export async function createCard(
  payload: CardCreatePayload,
  accessToken: string
): Promise<CardListItem> {
  const data = await apiFetch<CardApiItem>('/cards/', accessToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return normalizeCard(data)
}

// PATCH /cards/{card_id} — retorna CardResponse
export async function updateCard(
  cardId: string,
  payload: CardUpdatePayload,
  accessToken: string
): Promise<CardListItem> {
  const data = await apiFetch<CardApiItem>(`/cards/${cardId}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return normalizeCard(data)
}

// PATCH /cards/{card_id}/move — retorna CardResponse
export async function moveCard(
  cardId: string,
  payload: CardMovePayload,
  accessToken: string
): Promise<CardListItem> {
  const data = await apiFetch<CardApiItem>(`/cards/${cardId}/move`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return normalizeCard(data)
}

// DELETE /cards/{card_id} — retorna 204 No Content
export async function deleteCard(
  cardId: string,
  accessToken: string
): Promise<void> {
  await apiFetch<void>(`/cards/${cardId}`, accessToken, {
    method: 'DELETE',
  })
}