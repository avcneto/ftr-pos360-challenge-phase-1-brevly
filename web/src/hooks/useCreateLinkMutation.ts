import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

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
      const normalizedPath = path.startsWith('/') ? path : `/${path}`

      const response = await fetch(normalizedPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const responseData = await response
        .json()
        .catch(() => null) as { message?: string } | null

      if (!response.ok) {
        throw new Error(responseData?.message ?? 'Erro ao salvar link.')
      }

      return responseData as TResponse
    },
    ...options,
  })
}
