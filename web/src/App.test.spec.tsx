import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('should render main sections and logo', () => {
    const queryClient = new QueryClient()

    const html = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )

    expect(html).toContain('brev.ly')
    expect(html).toContain('Novo link')
    expect(html).toContain('Meus links')
  })
})
