import { apiFetch } from '@/lib/api-client'
import {
  BoardApiRaw,
  BoardListItem,
  BoardsApiResponse,
  CreateBoardPayload,
  CreateBoardResponse,
  UpdateBoardPayload,
} from '@/types/board.types'

function normalizeStatus(status?: string): 'active' | 'archived' | 'draft' {
  if (status === 'archived') return 'archived'
  if (status === 'draft') return 'draft'
  return 'active'
}

function normalizeBoard(raw: BoardApiRaw): BoardListItem {
  return {
    id:           raw.id,
    name:         raw.name ?? raw.title ?? 'Board sem nome',
    description:  raw.description ?? null,
    sector:       raw.sector ?? null,
    status:       normalizeStatus(raw.status),

    columnsCount: raw.columns_count ?? raw.columnsCount ?? 0,
    cardsCount:   raw.cards_count   ?? raw.cardsCount   ?? 0,
    createdAt:    raw.created_at    ?? raw.createdAt    ?? new Date().toISOString(),
    updatedAt:    raw.updated_at    ?? raw.updatedAt    ?? new Date().toISOString(),
  }
}

export async function getBoards(accessToken: string): Promise<BoardListItem[]> {
  const payload = await apiFetch<BoardsApiResponse | BoardApiRaw[]>(
    '/boards',
    accessToken
  )

  if (Array.isArray(payload))         return payload.map(normalizeBoard)
  if (Array.isArray(payload.items))   return payload.items.map(normalizeBoard)
  if (Array.isArray(payload.data))    return payload.data.map(normalizeBoard)
  if (Array.isArray(payload.results)) return payload.results.map(normalizeBoard)
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