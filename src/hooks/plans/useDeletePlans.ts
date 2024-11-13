import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

import { planService } from '@/services/plan.service'

export function useDeletePlans() {
	const queryClient = useQueryClient()

	const { mutate: deletePlan } = useMutation({
		mutationKey: ['plans-delete'],
		mutationFn: (id: string) => planService.delete(id),
		onSuccess: () => {
			toast.info('Запись перенесена в архив')
			queryClient.invalidateQueries({ queryKey: ['plans'] })
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Plan has related records') {
				toast.warning('Запись имеет связь с вычитанными часами')
			}
		}
	})

	return { deletePlan }
}
