export type Link = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: string
  createdAt: string
}

export type CreateLinkRequest = {
  originalUrl: string
  shortUrl: string
}

export type CreateLinkResponse = Link

export type DeleteLinkResponse = {
  message: string
}
