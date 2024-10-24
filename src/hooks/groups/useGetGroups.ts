import { useQuery } from '@tanstack/react-query'

import { groupService } from '@/services/group.service'

export function useGetGroups() {
	const { data, isLoading } = useQuery({
		queryKey: ['groups'],
		queryFn: () => {
			return groupService.getAll()
		}
	})

	return { data, isLoading }
}
