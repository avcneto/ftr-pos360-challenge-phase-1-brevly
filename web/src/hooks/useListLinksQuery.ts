import { useQuery } from '@tanstack/react-query'
import type { Link } from '../types'
import { buildApiUrl } from '../utils'

export const useListLinksQuery = () => {
  return useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('/links'))

      const responseData = (await response.json().catch(() => null)) as
        | { message?: string }
        | Link[]
        | null

      if (!response.ok) {
        throw new Error(
          (responseData as { message?: string } | null)?.message ??
            'Erro ao carregar links.'
        )
      }

      return (responseData ?? []) as Link[]
    },
  })
}
