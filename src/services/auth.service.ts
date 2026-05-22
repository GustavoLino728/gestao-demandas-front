import type {
  LoginRequest,
  TokenResponse,
  AccessTokenResponse,
  RefreshRequest,
} from '@/types/auth.types'
import { api } from '@/lib/api'

export const authService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login', data)
    return response.data
  },

  refresh: async (data: RefreshRequest): Promise<AccessTokenResponse> => {
    const response = await api.post<AccessTokenResponse>('/auth/refresh', data)
    return response.data
  },
}