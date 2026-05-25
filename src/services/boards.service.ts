import { BoardApiItem, BoardListItem, BoardsApiResponse, CreateBoardPayload, CreateBoardResponse } from '@/types/board.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')

function normalizeBoard(board: BoardApiItem): BoardListItem {
  return {
    id: board.id,
    name: board.name ?? board.title ?? 'Board sem nome',
    description: board.description ?? null,
    sector: board.sector ?? null,
    status: normalizeStatus(board.status),
    columns_count: board.columns_count ?? board.columnsCount ?? 0,
    cards_count: board.cards_count ?? board.cardsCount ?? 0,
    created_at: board.created_at ?? board.createdAt ?? new Date().toISOString(),
    updated_at: board.updated_at ?? board.updatedAt ?? new Date().toISOString(),
  }
}

function normalizeStatus(status?: string): 'active' | 'archived' | 'draft' {
  if (status === 'archived') return 'archived'
  if (status === 'draft') return 'draft'
  return 'active'
}

export async function getBoards(accessToken: string): Promise<BoardListItem[]> {
  const url = `${API_URL}/api/v1/boards`
  console.log('GET BOARDS URL =>', url)

  const response = await fetch(url, {
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
      result?.message ||
        result?.detail ||
        'Não foi possível carregar os boards.'
    )
  }

  const payload = result as BoardsApiResponse | BoardApiItem[]

  if (Array.isArray(payload)) return payload.map(normalizeBoard)
  if (Array.isArray(payload.items)) return payload.items.map(normalizeBoard)
  if (Array.isArray(payload.data)) return payload.data.map(normalizeBoard)
  if (Array.isArray(payload.results)) return payload.results.map(normalizeBoard)

  return []
}

export async function createBoard(
  payload: CreateBoardPayload,
  accessToken: string
): Promise<CreateBoardResponse> {
  const response = await fetch(`${API_URL}/api/v1/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      result?.message ||
        result?.detail ||
        'Não foi possível criar o board.'
    )
  }

  return result as CreateBoardResponse
}