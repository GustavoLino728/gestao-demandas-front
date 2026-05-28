const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  accessToken: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}/api/v1${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
    cache: 'no-store',
  })

  if (response.status === 204) return undefined as T

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      result?.detail || result?.message || 'Erro na requisição.',
      response.status,
      result
    )
  }

  return result as T
}