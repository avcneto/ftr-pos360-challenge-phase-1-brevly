import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('should render main sections and logo', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('brev.ly')
    expect(html).toContain('Novo link')
    expect(html).toContain('Meus links')
  })
})
