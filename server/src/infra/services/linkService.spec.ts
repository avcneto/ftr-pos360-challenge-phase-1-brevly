import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockSelect,
  mockSelectFrom,
  mockSelectWhere,
  mockSelectLimit,
  mockInsert,
  mockInsertValues,
  mockInsertReturning,
  mockUpdate,
  mockUpdateSet,
  mockUpdateWhere,
  mockUpdateReturning,
  mockDelete,
  mockDeleteWhere,
  mockDeleteReturning,
} = vi.hoisted(() => {
  const mockSelectLimit = vi.fn()
  const mockSelectWhere = vi.fn(() => ({ limit: mockSelectLimit }))
  const mockSelectFrom = vi.fn()
  const mockSelect = vi.fn(() => ({ from: mockSelectFrom }))

  const mockInsertReturning = vi.fn()
  const mockInsertValues = vi.fn(() => ({ returning: mockInsertReturning }))
  const mockInsert = vi.fn(() => ({ values: mockInsertValues }))

  const mockUpdateReturning = vi.fn()
  const mockUpdateWhere = vi.fn(() => ({ returning: mockUpdateReturning }))
  const mockUpdateSet = vi.fn(() => ({ where: mockUpdateWhere }))
  const mockUpdate = vi.fn(() => ({ set: mockUpdateSet }))

  const mockDeleteReturning = vi.fn()
  const mockDeleteWhere = vi.fn(() => ({ returning: mockDeleteReturning }))
  const mockDelete = vi.fn(() => ({ where: mockDeleteWhere }))

  return {
    mockSelect,
    mockSelectFrom,
    mockSelectWhere,
    mockSelectLimit,
    mockInsert,
    mockInsertValues,
    mockInsertReturning,
    mockUpdate,
    mockUpdateSet,
    mockUpdateWhere,
    mockUpdateReturning,
    mockDelete,
    mockDeleteWhere,
    mockDeleteReturning,
  }
})

vi.mock('../db', () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  },
}))

import { linkService } from './linkService'

describe('linkService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should find a link by short url', async () => {
    const createdAt = new Date('2026-03-02T00:00:00.000Z')

    mockSelectFrom.mockReturnValueOnce({ where: mockSelectWhere })
    mockSelectLimit.mockResolvedValueOnce([
      {
        id: 'id-1',
        originalUrl: 'https://www.rocketseat.com.br',
        shortUrl: 'rocketseat',
        accessCount: '10',
        createdAt,
      },
    ])

    const result = await linkService.findByShortUrl('rocketseat')

    expect(mockSelectWhere).toHaveBeenCalledTimes(1)
    expect(mockSelectLimit).toHaveBeenCalledWith(1)
    expect(result).toEqual({
      id: 'id-1',
      originalUrl: 'https://www.rocketseat.com.br',
      shortUrl: 'rocketseat',
      accessCount: '10',
      createdAt,
    })
  })

  it('should list all links', async () => {
    const createdAt = new Date('2026-03-02T00:00:00.000Z')

    mockSelectFrom.mockResolvedValueOnce([
      {
        id: 'id-1',
        originalUrl: 'https://www.rocketseat.com.br',
        shortUrl: 'rocketseat',
        accessCount: '10',
        createdAt,
      },
    ])

    const result = await linkService.listAll()

    expect(mockSelect).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(1)
  })

  it('should create a link with access count initialized as 0', async () => {
    const createdAt = new Date('2026-03-02T00:00:00.000Z')

    mockInsertReturning.mockResolvedValueOnce([
      {
        id: 'id-1',
        originalUrl: 'https://www.rocketseat.com.br',
        shortUrl: 'rocketseat',
        accessCount: '0',
        createdAt,
      },
    ])

    const result = await linkService.create({
      originalUrl: 'https://www.rocketseat.com.br',
      shortUrl: 'rocketseat',
    })

    expect(mockInsertValues).toHaveBeenCalledWith({
      originalUrl: 'https://www.rocketseat.com.br',
      shortUrl: 'rocketseat',
      accessCount: '0',
    })
    expect(result?.accessCount).toBe('0')
  })

  it('should increment access count by id', async () => {
    const createdAt = new Date('2026-03-02T00:00:00.000Z')

    mockUpdateReturning.mockResolvedValueOnce([
      {
        id: 'id-1',
        originalUrl: 'https://www.rocketseat.com.br',
        shortUrl: 'rocketseat',
        accessCount: '11',
        createdAt,
      },
    ])

    const result = await linkService.incrementAccessById('id-1')

    expect(mockUpdateSet).toHaveBeenCalledTimes(1)
    expect(mockUpdateWhere).toHaveBeenCalledTimes(1)
    expect(result?.accessCount).toBe('11')
  })

  it('should return true when a link is deleted', async () => {
    mockDeleteReturning.mockResolvedValueOnce([{ id: 'id-1' }])

    const result = await linkService.deleteById('id-1')

    expect(mockDeleteWhere).toHaveBeenCalledTimes(1)
    expect(result).toBe(true)
  })

  it('should return false when link is not found on delete', async () => {
    mockDeleteReturning.mockResolvedValueOnce([])

    const result = await linkService.deleteById('not-found')

    expect(result).toBe(false)
  })
})
