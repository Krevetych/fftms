import { useQuery } from '@tanstack/react-query'

import { IFilteredGroup } from '@/types/group.types'

import { groupService } from '@/services/group.service'

export function useGetFilteredGroups({
	filters
}: {
	filters: IFilteredGroup | undefined
}) {
	const { data: fGroupsData } = useQuery({
		queryKey: ['filtered-groups', filters],
		queryFn: () => (filters ? groupService.getFiltered(filters) : []),
		enabled: !!filters
	})

	return { fGroupsData }
}
