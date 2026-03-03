import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import type { DeleteLinkResponse } from '../types'
import { buildApiUrl } from '../utils'

type DeleteLinkMutationOptions = Omit<
  UseMutationOptions<DeleteLinkResponse, Error, string>,
  'mutationFn'
>

export const useDeleteLinkMutation = (options?: DeleteLinkMutationOptions) => {
  return useMutation<DeleteLinkResponse, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(buildApiUrl(`/links/${id}`), {
        method: 'DELETE',
      })

      const responseData = (await response.json().catch(() => null)) as {
        message?: string
      } | null

      if (!response.ok) {
        throw new Error(responseData?.message ?? 'Erro ao excluir link.')
      }

      return {
        message: responseData?.message ?? 'Link excluído com sucesso.',
      }
    },
    ...options,
  })
}
