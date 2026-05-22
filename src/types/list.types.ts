// Espelha ListResponse do schemas.py
export interface ListApiItem {
  id: string
  name: string
  position: number
  board_id: string
  created_at: string
}

export type ListItem = ListApiItem

// Shape de uma coluna com seus cards já carregados — usado na UI do Kanban
export interface KanbanColumn {
  id: string
  name: string
  position: number
  board_id: string
  created_at: string
  cards: import('./card.types').CardListItem[]
}