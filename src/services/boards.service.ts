import { apiFetch } from '@/lib/api-client'
import {
  BoardApiItem,
  BoardListItem,
  BoardsApiResponse,
  CreateBoardPayload,
  CreateBoardResponse,
} from '@/types/board.types'

function normalizeStatus(status?: string): 'active' | 'archived' | 'draft' {
  if (status === 'archived') return 'archived'
  if (status === 'draft') return 'draft'
  return 'active'
}

function normalizeBoard(board: BoardApiItem): BoardListItem {
  return {
    id:           board.id,
    name:         board.name ?? board.title ?? 'Board sem nome',
    description:  board.description ?? null,
    sector:       board.sector ?? null,
    status:       normalizeStatus(board.status),
    columns_count: board.columns_count ?? board.columnsCount ?? 0,
    cards_count:   board.cards_count ?? board.cardsCount ?? 0,
    created_at:   board.created_at ?? board.createdAt ?? new Date().toISOString(),
    updated_at:   board.updated_at ?? board.updatedAt ?? new Date().toISOString(),
  }
}

export async function getBoards(accessToken: string): Promise<BoardListItem[]> {
  const payload = await apiFetch<BoardsApiResponse | BoardApiItem[]>(
    '/boards',
    accessToken
  )

  if (Array.isArray(payload))          return payload.map(normalizeBoard)
  if (Array.isArray(payload.items))    return payload.items.map(normalizeBoard)
  if (Array.isArray(payload.data))     return payload.data.map(normalizeBoard)
  if (Array.isArray(payload.results))  return payload.results.map(normalizeBoard)
  return []
}

export async function createBoard(
  payload: CreateBoardPayload,
  accessToken: string
): Promise<CreateBoardResponse> {
  return apiFetch<CreateBoardResponse>('/boards', accessToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface UpdateBoardPayload {
  name?: string
  description?: string | null
}

export async function updateBoard(
  boardId: string,
  payload: UpdateBoardPayload,
  accessToken: string
): Promise<CreateBoardResponse> {
  return apiFetch<CreateBoardResponse>(`/boards/${boardId}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteBoard(
  boardId: string,
  accessToken: string
): Promise<void> {
  return apiFetch<void>(`/boards/${boardId}`, accessToken, {
    method: 'DELETE',
  })
}