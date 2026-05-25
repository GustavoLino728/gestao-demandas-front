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