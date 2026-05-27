export type CardPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface CardApiItem {
  id: string
  title: string
  description: string | null
  priority: CardPriority
  position: number
  due_date: string | null
  list_id: string
  assignee_id: string | null
  created_at: string
  updated_at: string
}

export interface CardDetailApiItem extends CardApiItem {
  history: CardHistoryApiItem[]
}

export interface CardHistoryApiItem {
  id: string
  field_changed: string
  old_value: string | null
  new_value: string | null
  changed_by: string | null
  changed_at: string
}

export interface CardCreatePayload {
  title: string
  description?: string | null
  priority?: CardPriority
  due_date?: string | null
  list_id: string
  assignee_id?: string | null
}

export interface CardUpdatePayload {
  title?: string
  description?: string | null
  priority?: CardPriority
  due_date?: string | null
  assignee_id?: string | null
}

export interface CardMovePayload {
  list_id: string
  position: number
}

export type CardListItem = CardApiItem