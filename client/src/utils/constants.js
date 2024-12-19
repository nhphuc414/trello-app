let apiRoot = ''
if (import.meta.env.MODE === 'development') {
  apiRoot = 'http://localhost:8016'
} else if (import.meta.env.MODE === 'production') {
  apiRoot = 'https://server.trellonhp.site'
}
export const API_ROOT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12
export const DEFAULT_SORT_BY = 'date'
export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}
export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}
