import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DOWNLOAD_CSV_LABEL,
  DOWNLOAD_CSV_LOADING_LABEL,
  MY_LINKS_LOADING_LABEL,
  MY_LINKS_TITLE,
} from '../../constants/texts'
import { MyLinks } from './MyLinks'

const { useListLinksQueryMock } = vi.hoisted(() => ({
  useListLinksQueryMock: vi.fn(),
}))

const { useDownloadLinksCsvQueryMock } = vi.hoisted(() => ({
  useDownloadLinksCsvQueryMock: vi.fn(),
}))

const { useDeleteLinkMutationMock } = vi.hoisted(() => ({
  useDeleteLinkMutationMock: vi.fn(),
}))

vi.mock('../../hooks/useListLinksQuery', () => ({
  useListLinksQuery: useListLinksQueryMock,
}))

vi.mock('../../hooks/useDownloadLinksCsvQuery', () => ({
  useDownloadLinksCsvQuery: useDownloadLinksCsvQueryMock,
}))

vi.mock('../../hooks/useDeleteLinkMutation', () => ({
  useDeleteLinkMutation: useDeleteLinkMutationMock,
}))

describe('MyLinks', () => {
  beforeEach(() => {
    useListLinksQueryMock.mockReset()
    useDownloadLinksCsvQueryMock.mockReset()
    useDeleteLinkMutationMock.mockReset()

    useListLinksQueryMock.mockReturnValue({
      data: [
        {
          id: 'id-1',
          shortUrl: 'rocketseat',
          originalUrl: 'https://www.rocketseat.com.br',
          accessCount: '31',
          createdAt: '2026-03-02T00:00:00.000Z',
        },
      ],
      refetch: vi.fn(),
      isLoading: false,
      isFetching: false,
    })

    useDownloadLinksCsvQueryMock.mockReturnValue({
      refetch: vi.fn(),
      isFetching: false,
    })

    useDeleteLinkMutationMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
  })

  it('should render title, csv action and list item', () => {
    const html = renderToStaticMarkup(<MyLinks />)

    expect(html).toContain(MY_LINKS_TITLE)
    expect(html).toContain(DOWNLOAD_CSV_LABEL)
    expect(html).toContain('rocketseat')
    expect(html).toContain('https://www.rocketseat.com.br')
  })

  it('should disable csv button when there are no links', () => {
    useListLinksQueryMock.mockReturnValueOnce({
      data: [],
      refetch: vi.fn(),
      isLoading: false,
      isFetching: false,
    })

    const html = renderToStaticMarkup(<MyLinks />)

    expect(html).toContain(DOWNLOAD_CSV_LABEL)
    expect(html).toContain('disabled=""')
  })

  it('should render loading label while csv download is in progress', () => {
    useDownloadLinksCsvQueryMock.mockReturnValueOnce({
      refetch: vi.fn(),
      isFetching: true,
    })

    const html = renderToStaticMarkup(<MyLinks />)

    expect(html).toContain(DOWNLOAD_CSV_LOADING_LABEL)
    expect(html).not.toContain(DOWNLOAD_CSV_LABEL)
    expect(html).toContain('animate-spin')
  })

  it('should render loading while links are being fetched', () => {
    useListLinksQueryMock.mockReturnValueOnce({
      data: [],
      refetch: vi.fn(),
      isLoading: true,
      isFetching: false,
    })

    const html = renderToStaticMarkup(<MyLinks />)

    expect(html).toContain(MY_LINKS_LOADING_LABEL)
    expect(html).toContain('animate-spin')
  })
})
