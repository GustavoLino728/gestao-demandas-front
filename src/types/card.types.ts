// Espelha CardPriority do models.py
export type CardPriority = 'low' | 'medium' | 'high' | 'urgent'

// Espelha CardResponse do schemas.py — campos garantidos, sem opcionais desnecessários
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

// Espelha CardDetailResponse — herda CardResponse + history
export interface CardDetailApiItem extends CardApiItem {
  history: CardHistoryApiItem[]
}

// Espelha CardHistoryResponse
export interface CardHistoryApiItem {
  id: string
  field_changed: string
  old_value: string | null
  new_value: string | null
  changed_by: string | null
  changed_at: string
}

// Espelha CardCreate — o que o POST / espera
export interface CardCreatePayload {
  title: string
  description?: string | null
  priority?: CardPriority
  due_date?: string | null
  list_id: string
  assignee_id?: string | null
}

// Espelha CardUpdate — o que o PATCH /{card_id} espera
export interface CardUpdatePayload {
  title?: string
  description?: string | null
  priority?: CardPriority
  due_date?: string | null
  assignee_id?: string | null
}

// Espelha CardMove — o que o PATCH /{card_id}/move espera
export interface CardMovePayload {
  list_id: string
  position: number
}

// Shape normalizado para a UI (idêntico ao CardApiItem pois a API já é consistente)
export type CardListItem = CardApiItem