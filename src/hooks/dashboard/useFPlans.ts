import { useQuery } from '@tanstack/react-query'

import { IFilters } from '@/types/plan.types'

import { planService } from '@/services/plan.service'

export function useFPlans({ filters }: { filters: IFilters | undefined }) {
	const { data: fPlansData, isLoading: isLoadingFPlans } = useQuery({
		queryKey: ['f-plans', filters],
		queryFn: () => (filters ? planService.getFiltered(filters) : []),
		enabled: !!filters
	})

	return { fPlansData, isLoadingFPlans }
}
