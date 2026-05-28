import type { CardListItem } from './card.types'

export interface ListApiItem {
  id:         string
  name:       string
  position:   number
  board_id:   string
  created_at: string
}

export type ListItem = ListApiItem

export interface KanbanColumn {
  id:         string
  name:       string
  position:   number
  board_id:   string
  created_at: string
  cards:      CardListItem[]
}

export interface UpdateListPayload {
  name?:     string
  position?: number
}