import { useQuery } from '@tanstack/react-query'
import { buildApiUrl } from '../utils'

export const useDownloadLinksCsvQuery = () => {
  return useQuery({
    queryKey: ['links', 'csv'],
    enabled: false,
    queryFn: async () => {
      const response = await fetch(buildApiUrl('/links/export/csv'))

      if (!response.ok) {
        throw new Error('Erro ao baixar CSV.')
      }

      return response.text()
    },
  })
}
