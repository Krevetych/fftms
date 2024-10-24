import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ERate } from '@/types/plan.types'

import { subjectService } from '@/services/subject.service'

export function useDeleteSubjects({ rate }: { rate: ERate }) {
	const queryClient = useQueryClient()

	const { mutate: deleteSubject } = useMutation({
		mutationKey: ['subjects-delete', rate],
		mutationFn: (id: string) => subjectService.delete(id, rate),
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['subjects'] })
		}
	})

	return { deleteSubject }
}
