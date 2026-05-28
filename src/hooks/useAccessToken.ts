'use client'

import { useSession } from 'next-auth/react'

export function useAccessToken(): string | null {
  const { data: session, status } = useSession()

  if (status === 'loading' || status === 'unauthenticated') return null
  if (!session?.accessToken) return null

  return session.accessToken
}