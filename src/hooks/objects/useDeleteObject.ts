import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

import { objectService } from '@/services/object.service'

export function useDeleteObject() {
	const queryClient = useQueryClient()

	const { mutate: deleteObject } = useMutation({
		mutationKey: ['objects-delete'],
		mutationFn: (id: string) => objectService.delete(id),
		onSuccess: () => {
			toast.info('Запись перенесена в архив')
			queryClient.invalidateQueries({ queryKey: ['objects'] })
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message
			if (errorMessage === 'Object has related records') {
				toast.warning('Запись имеет связь с учебным планом')
			}
		}
	})

	return { deleteObject }
}
