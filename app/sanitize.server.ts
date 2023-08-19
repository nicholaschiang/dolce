import sanitizeHtml from 'sanitize-html'

export function sanitize(html: string, options?: sanitizeHtml.IOptions): string
export function sanitize(html: null, options?: sanitizeHtml.IOptions): null
export function sanitize(html: string | null, options?: sanitizeHtml.IOptions): string | null
export function sanitize(html: string | null, options?: sanitizeHtml.IOptions) {
  return html ? sanitizeHtml(html, options) : html
}
