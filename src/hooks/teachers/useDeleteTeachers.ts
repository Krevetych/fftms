import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

import { teacherService } from '@/services/teacher.service'

export function useDeleteTeachers() {
	const queryClient = useQueryClient()

	const { mutate: deleteTeacher } = useMutation({
		mutationKey: ['teachers-delete'],
		mutationFn: (id: string) => teacherService.delete(id),
		onSuccess: () => {
			toast.info('Запись перенесена в архив')
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Teacher has related records') {
				toast.warning('Запись имеет связь с учебным планом')
			}
		}
	})

	return { deleteTeacher }
}
