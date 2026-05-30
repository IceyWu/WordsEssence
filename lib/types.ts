// Domain + API types, derived from the Go API Swagger spec
// (https://wd.iceywu.cn/service/swagger/doc.json)

/** A single essay / quote record as returned by the API. */
export interface Essay {
  id: number
  author: string
  title: string
  /** Body text. Newlines (\n) separate display lines. */
  content: string
  book_name: string
  created_at: string
  updated_at: string
}

/** Standard response envelope: { code, message, data }. */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** Paginated list payload nested under `data`. */
export interface PageResult<T> {
  list: T[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

/** POST body — `content` is required, the rest optional. */
export interface CreateEssayInput {
  content: string
  author?: string
  title?: string
  book_name?: string
}

/** PUT body — every field optional. */
export interface UpdateEssayInput {
  content?: string
  author?: string
  title?: string
  book_name?: string
}

export interface ListParams {
  page?: number
  page_size?: number
  /** e.g. "id,desc" | "created_at,asc" */
  sort?: string
}
