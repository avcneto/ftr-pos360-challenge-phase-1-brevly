import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import {
  DOWNLOAD_CSV_LABEL,
  EXAMPLE_SHORT_URL,
  MY_LINKS_TITLE,
} from '../../constants/texts'
import { MyLinks } from './MyLinks'

describe('MyLinks', () => {
  it('should render title, csv action and list item', () => {
    const html = renderToStaticMarkup(<MyLinks />)

    expect(html).toContain(MY_LINKS_TITLE)
    expect(html).toContain(DOWNLOAD_CSV_LABEL)
    expect(html).toContain(EXAMPLE_SHORT_URL)
  })
})
