const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')

export interface ListApiItem {
  id: string
  name: string
  position: number
  board_id: string
  created_at: string
}

export type ListItem = ListApiItem

export interface KanbanColumn {
  id: string
  name: string
  position: number
  board_id: string
  created_at: string
  cards: import('./card.types').CardListItem[]
}

export interface UpdateListPayload {
  name?: string
  position?: number
}

export async function updateList(
  boardId: string,
  listId: string,
  payload: UpdateListPayload,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/v1/boards/${boardId}/lists/${listId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  )
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      result?.message || result?.detail || 'Não foi possível atualizar a lista.'
    )
  }
}

export async function deleteList(
  boardId: string,
  listId: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/v1/boards/${boardId}/lists/${listId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(
      result?.message || result?.detail || 'Não foi possível excluir a lista.'
    )
  }
}