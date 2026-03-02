import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  INVALID_ORIGINAL_LINK_MESSAGE,
  INVALID_SHORT_LINK_MESSAGE,
  NEW_LINK_TITLE,
  ORIGINAL_LINK_LABEL,
  SAVE_LINK_BUTTON_LABEL,
  SHORT_LINK_LABEL,
} from '../../constants/texts'
import { NewLinkForm } from './NewLinkForm'

type NewLinkFormData = {
  originalLink: string
  shortLink: string
}

type RegisterOptions = {
  onChange?: (event: { target: { value: string } }) => void
  validate?: (value: string) => boolean | string
}

const { registerMock, handleSubmitMock, useFormMock } = vi.hoisted(() => ({
  registerMock: vi.fn(),
  handleSubmitMock: vi.fn(),
  useFormMock: vi.fn(),
}))

vi.mock('react-hook-form', () => ({
  useForm: useFormMock,
}))

const createUseFormReturn = (
  errors: {
    originalLink?: { message?: string }
    shortLink?: { message?: string }
  } = {}
) => ({
  register: registerMock,
  handleSubmit: handleSubmitMock,
  formState: { errors },
})

describe('NewLinkForm', () => {
  beforeEach(() => {
    registerMock.mockReset()
    handleSubmitMock.mockReset()
    useFormMock.mockReset()

    registerMock.mockImplementation(() => ({}))
    handleSubmitMock.mockImplementation((onSubmit: (data: NewLinkFormData) => void) => {
      return () => onSubmit({ originalLink: 'https://example.com', shortLink: 'example' })
    })
    useFormMock.mockReturnValue(createUseFormReturn())
  })

  it('should render form labels, placeholders and enabled submit button', () => {
    const html = renderToStaticMarkup(<NewLinkForm />)

    expect(html).toContain(NEW_LINK_TITLE)
    expect(html).toContain(ORIGINAL_LINK_LABEL)
    expect(html).toContain(SHORT_LINK_LABEL)
    expect(html).toContain(SAVE_LINK_BUTTON_LABEL)
    expect(html).toContain('www.exemplo.com.br')
    expect(html).toContain('brev.ly/')
    expect(html).toContain('h-[340px]')
    expect(html).not.toContain('disabled=""')
  })

  it('should render validation errors and expanded container when form has errors', () => {
    useFormMock.mockReturnValueOnce(
      createUseFormReturn({
        originalLink: { message: INVALID_ORIGINAL_LINK_MESSAGE },
        shortLink: { message: INVALID_SHORT_LINK_MESSAGE },
      })
    )

    const html = renderToStaticMarkup(<NewLinkForm />)

    expect(html).toContain(INVALID_ORIGINAL_LINK_MESSAGE)
    expect(html).toContain(INVALID_SHORT_LINK_MESSAGE)
    expect(html).toContain('h-[400px]')
  })

  it('should validate original link with protocol normalization', () => {
    renderToStaticMarkup(<NewLinkForm />)

    const originalLinkRegister = registerMock.mock.calls.find(
      (call) => call[0] === 'originalLink'
    )

    expect(originalLinkRegister).toBeDefined()

    const options = originalLinkRegister?.[1] as RegisterOptions
    expect(options.validate?.('www.google.com')).toBe(true)
    expect(options.validate?.('http://www.google.com')).toBe(true)
    expect(options.validate?.('://invalid')).toBe(INVALID_ORIGINAL_LINK_MESSAGE)
  })

  it('should execute onChange handlers for both fields', () => {
    renderToStaticMarkup(<NewLinkForm />)

    const originalLinkRegister = registerMock.mock.calls.find(
      (call) => call[0] === 'originalLink'
    )
    const shortLinkRegister = registerMock.mock.calls.find(
      (call) => call[0] === 'shortLink'
    )

    const originalLinkOptions = originalLinkRegister?.[1] as RegisterOptions
    const shortLinkOptions = shortLinkRegister?.[1] as RegisterOptions

    expect(originalLinkOptions.onChange).toBeTypeOf('function')
    expect(shortLinkOptions.onChange).toBeTypeOf('function')

    expect(() => {
      originalLinkOptions.onChange?.({ target: { value: 'https://example.com' } })
      shortLinkOptions.onChange?.({ target: { value: 'example' } })
    }).not.toThrow()
  })

  it('should submit valid form data', () => {
    const payload = { originalLink: 'https://www.google.com', shortLink: 'google' }
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    handleSubmitMock.mockImplementationOnce((onSubmit: (data: NewLinkFormData) => void) => {
      onSubmit(payload)
      return () => undefined
    })

    renderToStaticMarkup(<NewLinkForm />)

    expect(consoleLogSpy).toHaveBeenCalledWith('new-link-form', payload)
    consoleLogSpy.mockRestore()
  })
})
