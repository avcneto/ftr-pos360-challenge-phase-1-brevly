import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import { buildApiUrl } from '../utils'

type CreateLinkMutationOptions<TResponse, TBody> = Omit<
  UseMutationOptions<TResponse, Error, TBody>,
  'mutationFn'
>

export const useCreateLinkMutation = <TBody, TResponse>(
  path: string,
  options?: CreateLinkMutationOptions<TResponse, TBody>
) => {
  return useMutation<TResponse, Error, TBody>({
    mutationFn: async (body) => {
      const response = await fetch(buildApiUrl(path), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const responseData = (await response.json().catch(() => null)) as {
        message?: string
      } | null

      if (!response.ok) {
        throw new Error(responseData?.message ?? 'Erro ao salvar link.')
      }

      return responseData as TResponse
    },
    ...options,
  })
}
