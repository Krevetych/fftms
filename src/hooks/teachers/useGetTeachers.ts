import { useQuery } from '@tanstack/react-query'

import { teacherService } from '@/services/teacher.service'

export function useGetTeachers() {
	const { data, isLoading } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => teacherService.getAll()
	})

	return { data, isLoading }
}
