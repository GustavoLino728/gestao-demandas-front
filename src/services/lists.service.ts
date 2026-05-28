import { apiFetch } from '@/lib/api-client'
import { ListApiItem, ListItem } from '@/types/list.types'

export async function getListsByBoard(
  boardId: string,
  accessToken: string
): Promise<ListItem[]> {
  return apiFetch<ListApiItem[]>(`/boards/${boardId}/lists`, accessToken)
}

export async function createList(
  boardId: string,
  payload: { name: string; position: number },
  accessToken: string
): Promise<ListItem> {
  return apiFetch<ListItem>(`/boards/${boardId}/lists/`, accessToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateList(
  boardId: string,
  listId: string,
  payload: { name: string },
  accessToken: string
): Promise<ListItem> {
  return apiFetch<ListItem>(`/boards/${boardId}/lists/${listId}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteList(
  boardId: string,
  listId: string,
  accessToken: string
): Promise<void> {
  return apiFetch<void>(`/boards/${boardId}/lists/${listId}`, accessToken, {
    method: 'DELETE',
  })
}