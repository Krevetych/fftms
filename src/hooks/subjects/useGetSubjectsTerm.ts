import { useQuery } from '@tanstack/react-query'

import { ERate } from '@/types/plan.types'
import { ITermForm } from '@/types/subject.types'

import { subjectService } from '@/services/subject.service'

export function useGetSubjectsTerm({
	filters,
	rate
}: {
	filters: any
	rate: ERate
}) {
	const { data: fSubjectTermData } = useQuery({
		queryKey: ['filtered-subject-term', filters],
		queryFn: () =>
			filters ? subjectService.getFilteredTerm(filters as ITermForm) : [],
		enabled: !!filters && rate !== ERate.HOURLY
	})

	return { fSubjectTermData }
}
