import { useQuery } from '@tanstack/react-query'

import { planService } from '@/services/plan.service'

export function useGetPlans() {
	const { data, isLoading } = useQuery({
		queryKey: ['plans'],
		queryFn: () => planService.getAll()
	})

	return { data, isLoading }
}
