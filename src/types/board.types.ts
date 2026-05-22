export type BoardStatus = 'active' | 'archived' | 'draft'

export interface BoardApiItem {
  id: string
  name?: string
  title?: string
  description?: string | null
  sector?: string | null
  status?: BoardStatus | string
  columns_count?: number
  cards_count?: number
  columnsCount?: number
  cardsCount?: number
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
}

export interface BoardsApiResponse {
  items?: BoardApiItem[]
  data?: BoardApiItem[]
  results?: BoardApiItem[]
  total?: number
  page?: number
  size?: number
}

export interface BoardListItem {
  id: string
  name: string
  description: string | null
  sector: string | null
  status: BoardStatus
  columns_count: number
  cards_count: number
  created_at: string
  updated_at: string
}