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
    throw new Error(
      result?.detail ||
      result?.message ||
      'Erro ao carregar dados.'
    )
  }

  return result as T
}

export async function getListsByBoard(
  boardId: string,
  accessToken: string
): Promise<ListItem[]> {
  return apiFetch<ListApiItem[]>(`/boards/${boardId}/lists`, accessToken)
}