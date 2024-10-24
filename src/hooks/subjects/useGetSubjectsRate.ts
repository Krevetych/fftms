import { useQuery } from '@tanstack/react-query'

import { ERate } from '@/types/plan.types'

import { subjectService } from '@/services/subject.service'

export function useGetSubjectsRate({ rate }: { rate: ERate }) {
	const { data: subjectsData, isLoading } = useQuery({
		queryKey: ['subjects', rate],
		queryFn: () => {
			return subjectService.getByRate(rate)
		}
	})

	return { subjectsData, isLoading }
}
