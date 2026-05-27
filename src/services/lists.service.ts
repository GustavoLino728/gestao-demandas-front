import { ListApiItem, ListItem } from '@/types/list.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')

async function apiFetch<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.detail || result?.message || 'Erro ao carregar dados.')
  }

  return result as T
}

export async function getListsByBoard(
  boardId: string,
  accessToken: string
): Promise<ListItem[]> {
  return apiFetch<ListApiItem[]>(`/boards/${boardId}/lists`, accessToken)
}

export async function createList(
  boardId: string,
  payload: {
    name: string
    position: number
  },
  accessToken: string
): Promise<ListItem> {
  const response = await fetch(`${API_URL}/api/v1/boards/${boardId}/lists/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.detail || result?.message || 'Erro ao criar lista.')
  }

  return result as ListItem
}

export async function updateList(
  boardId: string,
  listId: string,
  payload: { name: string },
  accessToken: string
): Promise<ListItem> {
  const response = await fetch(`${API_URL}/api/v1/boards/${boardId}/lists/${listId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.detail || result?.message || 'Erro ao atualizar lista.')
  }

  return result as ListItem
}

export async function deleteList(
  boardId: string,
  listId: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/boards/${boardId}/lists/${listId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const result = await response.json().catch(() => null)

    throw new Error(result?.detail || result?.message || 'Erro ao deletar lista.')
  }
}