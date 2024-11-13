import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

import { groupService } from '@/services/group.service'

export function useDeleteGroup() {
	const queryClient = useQueryClient()

	const { mutate: deleteGroup } = useMutation({
		mutationKey: ['groups-delete'],
		mutationFn: (id: string) => groupService.delete(id),
		onSuccess: () => {
			toast.info('Запись перенесена в архив')
			queryClient.invalidateQueries({ queryKey: ['groups'] })
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Group has related records') {
				toast.warning('Запись имеет связь с учебным планом')
			}
		}
	})

	return { deleteGroup }
}
