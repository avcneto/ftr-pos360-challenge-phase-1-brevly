import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import {
  REDIRECTING_DESCRIPTION,
  REDIRECTING_FALLBACK_LINK,
  REDIRECTING_TITLE,
} from '../constants/texts'
import { Redirecting } from './Redirecting'

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: string; to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useParams: () => ({ shortUrl: 'rocketseat' }),
}))

describe('Redirecting page', () => {
  it('should render redirecting content and fallback link', () => {
    useQueryMock.mockReturnValue({
      data: null,
      isSuccess: false,
    })

    const html = renderToStaticMarkup(<Redirecting />)

    expect(html).toContain(REDIRECTING_TITLE)
    expect(html).toContain(REDIRECTING_DESCRIPTION)
    expect(html).toContain(REDIRECTING_FALLBACK_LINK)
    expect(html).toContain('Logo_Icon.svg')
  })
})
