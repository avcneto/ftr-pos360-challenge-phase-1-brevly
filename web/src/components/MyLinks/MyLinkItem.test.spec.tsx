import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ACCESSES_LABEL } from '../../constants/texts'
import { MyLinkItem } from './MyLinkItem'

describe('MyLinkItem', () => {
  it('should render urls, access count and action buttons', () => {
    const html = renderToStaticMarkup(
      <MyLinkItem
        shortUrl='portfolio-dev'
        originalUrl='https://www.rocketseat.com.br/'
        accessCount={30}
      />
    )

    expect(html).toContain('portfolio-dev')
    expect(html).toContain('https://www.rocketseat.com.br/')
    expect(html).toContain(`30 ${ACCESSES_LABEL}`)
    expect(html).toContain('Copiar link')
    expect(html).toContain('Excluir link')
  })
})
