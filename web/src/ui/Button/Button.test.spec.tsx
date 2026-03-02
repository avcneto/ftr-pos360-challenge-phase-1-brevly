import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('should render children and button attributes', () => {
    const html = renderToStaticMarkup(
      <Button type='submit' disabled>
        Save
      </Button>
    )

    expect(html).toContain('Save')
    expect(html).toContain('type="submit"')
    expect(html).toContain('disabled')
  })
})
