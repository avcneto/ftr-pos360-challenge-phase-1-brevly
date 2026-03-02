import { useQuery } from '@tanstack/react-query'

export const useDownloadLinksCsvQuery = () => {
  return useQuery({
    queryKey: ['links', 'csv'],
    enabled: false,
    queryFn: async () => {
      const response = await fetch('/links/export/csv')

      if (!response.ok) {
        throw new Error('Erro ao baixar CSV.')
      }

      return response.text()
    },
  })
}
