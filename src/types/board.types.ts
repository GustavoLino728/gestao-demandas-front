export type BoardStatus = 'active' | 'archived' | 'draft'

export interface BoardApiRaw {
  id:             string
  name?:          string
  title?:         string
  description?:   string | null
  sector?:        string | null
  status?:        BoardStatus | string

  columns_count?: number
  columnsCount?:  number
  cards_count?:   number
  cardsCount?:    number
  created_at?:    string
  createdAt?:     string
  updated_at?:    string
  updatedAt?:     string
}

export type BoardApiItem = BoardApiRaw

export interface BoardListItem {
  id:           string
  name:         string
  description:  string | null
  sector:       string | null
  status:       BoardStatus
  columnsCount: number
  cardsCount:   number
  createdAt:    string
  updatedAt:    string
}

export interface BoardsApiResponse {
  items?:   BoardApiRaw[]
  data?:    BoardApiRaw[]
  results?: BoardApiRaw[]
  total?:   number
  page?:    number
  size?:    number
}

export interface CreateBoardPayload {
  name:         string
  description?: string | null
  sector?:      string | null
}

export interface UpdateBoardPayload {
  name?:        string
  description?: string | null
}

export interface CreateBoardResponse {
  id:          string
  name:        string
  description: string | null
  sector:      string | null
  status:      BoardStatus
}