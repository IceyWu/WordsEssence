import type { Essay } from './types'

/** Split essay content into display lines, dropping trailing blanks. */
export function toLines(content: string): string[] {
  return content.replace(/\s+$/, '').split('\n')
}

/** Author name, trimmed (may be empty). */
export function authorOf(essay: Pick<Essay, 'author'>): string {
  return essay.author?.trim() ?? ''
}

/** Book / source name, trimmed (may be empty). */
export function bookOf(essay: Pick<Essay, 'book_name'>): string {
  return essay.book_name?.trim() ?? ''
}

/** True when an entry carries no author and no source. */
export function isAnonymous(
  essay: Pick<Essay, 'author' | 'book_name'>,
): boolean {
  return !authorOf(essay) && !bookOf(essay)
}

/**
 * Format the date portion of an ISO timestamp (e.g.
 * "2026-05-15T16:37:22.026+08:00") as "2026.05.15".
 * Reads the date directly from the string so it is deterministic and
 * timezone-stable (no hydration mismatch).
 */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '')
  if (!m) return ''
  return `${m[1]}.${m[2]}.${m[3]}`
}
