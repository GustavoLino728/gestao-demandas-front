import axios from 'axios'
import type {
  LoginRequest,
  TokenResponse,
  AccessTokenResponse,
  RefreshRequest,
} from '@/types/auth.types'

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

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