import { useQuery } from '@tanstack/react-query'

import { objectService } from '@/services/object.service'

export function useGetObjects() {
	const { data, isLoading } = useQuery({
		queryKey: ['objects'],
		queryFn: () => {
			return objectService.getAll()
		}
	})

	return { data, isLoading }
}
