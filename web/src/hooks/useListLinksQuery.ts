import { useQuery } from '@tanstack/react-query'

export type LinkItem = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: string
  createdAt: string
}

export const useListLinksQuery = () => {
  return useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await fetch('/links')

      const responseData = await response
        .json()
        .catch(() => null) as { message?: string } | LinkItem[] | null

      if (!response.ok) {
        throw new Error(
          (responseData as { message?: string } | null)?.message ??
            'Erro ao carregar links.'
        )
      }

      return (responseData ?? []) as LinkItem[]
    },
  })
}
