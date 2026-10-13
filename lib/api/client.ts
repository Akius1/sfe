import type { ApiErrorBody, ApiSuccess } from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'

function isErrorBody(body: unknown): body is ApiErrorBody {
  if (typeof body !== 'object' || body === null || !('error' in body)) return false
  const { error } = body as { error: unknown }
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error
}

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiSuccess<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  // A proxy or gateway can answer with HTML, so a failed parse must not hide the status.
  const body: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    if (isErrorBody(body)) throw new ApiError(res.status, body.error.code, body.error.message)
    throw new ApiError(res.status, 'UNKNOWN', FALLBACK_MESSAGE)
  }
  if (body === null) throw new ApiError(res.status, 'INVALID_RESPONSE', FALLBACK_MESSAGE)

  return body as ApiSuccess<T>
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, init),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
}
