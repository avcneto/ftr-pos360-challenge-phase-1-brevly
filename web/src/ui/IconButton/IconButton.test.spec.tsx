import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('should render label, icon and disabled state', () => {
    const html = renderToStaticMarkup(
      <IconButton icon='/download.svg' label='Download CSV' disabled />
    )

    expect(html).toContain('Download CSV')
    expect(html).toContain('src="/download.svg"')
    expect(html).toContain('disabled')
  })

  it('should render spinner when loading', () => {
    const html = renderToStaticMarkup(
      <IconButton icon='/download.svg' label='Carregando...' isLoading />
    )

    expect(html).toContain('Carregando...')
    expect(html).toContain('animate-spin')
    expect(html).not.toContain('src="/download.svg"')
  })
})
