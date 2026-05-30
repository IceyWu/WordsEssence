import 'server-only'

import { API_BASE_URL } from './env'
import type {
  ApiResponse,
  CreateEssayInput,
  Essay,
  ListParams,
  PageResult,
  UpdateEssayInput,
} from './types'

/**
 * Server-side data-access layer for the upstream Go API.
 *
 * This module is the only place that talks to the upstream service. It runs
 * exclusively on the server (`server-only`), so the browser never calls the
 * open upstream API directly — all writes funnel through our Server Actions,
 * where they can be authorised.
 */

const ESSAYS = `${API_BASE_URL}/api/v1/essays`

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * A fetch that turns low-level connection failures (DNS / unreachable network /
 * TLS) into a clear message instead of a bare `fetch failed`. undici raises a
 * TypeError with a `cause` for these — usually the server can't reach the
 * upstream host (e.g. broken IPv6 routing, blocked egress).
 */
async function connectFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init)
  } catch (e) {
    if (e instanceof TypeError) {
      throw new ApiError('无法连接数据服务，请检查服务器出站网络', 0)
    }
    throw e
  }
}

async function parseEnvelope<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Upstream request failed (${res.status})`
    try {
      const body = (await res.json()) as ApiResponse<unknown>
      if (body?.message) message = body.message
    } catch {
      // non-JSON error body; keep default message
    }
    throw new ApiError(message, res.status)
  }
  // 204 No Content (delete) has no body.
  if (res.status === 204) return undefined as T
  const body = (await res.json()) as ApiResponse<T>
  return body.data
}

/**
 * Fetch a page of essays. Cached via Cache Components so the immersive reading
 * view is served from the static shell; invalidated on mutation through the
 * `essays` tag.
 */
export async function listEssays(
  params: ListParams = {},
): Promise<PageResult<Essay>> {
  'use cache'
  const { cacheLife, cacheTag } = await import('next/cache')
  cacheLife('hours')
  cacheTag('essays')

  const qs = new URLSearchParams({
    page: String(params.page ?? 1),
    page_size: String(params.page_size ?? 1000),
    sort: params.sort ?? 'id,desc',
  })

  const res = await connectFetch(`${ESSAYS}?${qs}`, {
    headers: { accept: 'application/json' },
  })
  return parseEnvelope<PageResult<Essay>>(res)
}

export async function getEssay(id: number): Promise<Essay> {
  'use cache'
  const { cacheLife, cacheTag } = await import('next/cache')
  cacheLife('hours')
  cacheTag('essays', `essay:${id}`)

  const res = await connectFetch(`${ESSAYS}/${id}`, {
    headers: { accept: 'application/json' },
  })
  return parseEnvelope<Essay>(res)
}

// --- Mutations (called only from authorised Server Actions) ---

export async function createEssay(input: CreateEssayInput): Promise<Essay> {
  const res = await connectFetch(ESSAYS, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(input),
  })
  return parseEnvelope<Essay>(res)
}

export async function updateEssay(
  id: number,
  input: UpdateEssayInput,
): Promise<Essay> {
  const res = await connectFetch(`${ESSAYS}/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(input),
  })
  return parseEnvelope<Essay>(res)
}

export async function deleteEssay(id: number): Promise<void> {
  const res = await connectFetch(`${ESSAYS}/${id}`, { method: 'DELETE' })
  await parseEnvelope<void>(res)
}

export { ApiError }
