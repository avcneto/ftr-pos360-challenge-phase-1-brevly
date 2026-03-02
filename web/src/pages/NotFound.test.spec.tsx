import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { NOT_FOUND_DESCRIPTION, NOT_FOUND_TITLE } from '../constants/texts'
import { NotFound } from './NotFound'

describe('NotFound page', () => {
  it('should render not found title and description', () => {
    const html = renderToStaticMarkup(<NotFound />)

    expect(html).toContain(NOT_FOUND_TITLE)
    expect(html).toContain(NOT_FOUND_DESCRIPTION)
    expect(html).toContain('404.svg')
  })
})
