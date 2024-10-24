import { useQuery } from '@tanstack/react-query'

import { ERate } from '@/types/plan.types'
import { IForm } from '@/types/subject.types'

import { subjectService } from '@/services/subject.service'

export function useGetSubjects({
	filters,
	rate
}: {
	filters: any
	rate: ERate
}) {
	const { data: fSubjectData } = useQuery({
		queryKey: ['filtered-subject', filters],
		queryFn: () =>
			filters ? subjectService.getFiltered(filters as IForm) : [],
		enabled: !!filters && rate === ERate.HOURLY
	})

	return { fSubjectData }
}
