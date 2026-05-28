export const queryKeys = {
  boards: {
    root: ['boards'] as const,
    all: () => [...queryKeys.boards.root] as const,
    detail: (boardId: string) =>
      [...queryKeys.boards.root, boardId] as const,
  },

  lists: {
    root: ['lists'] as const,
    byBoard: (boardId: string) =>
      [...queryKeys.lists.root, 'board', boardId] as const,
  },

  cards: {
    root: ['cards'] as const,
    all: () => [...queryKeys.cards.root] as const,
    byList: (listId: string) =>
      [...queryKeys.cards.root, 'list', listId] as const,
    detail: (cardId: string) =>
      [...queryKeys.cards.root, 'detail', cardId] as const,
  },
} as const