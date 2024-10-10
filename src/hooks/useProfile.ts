import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

export function useProfile() {
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.getUser()
	})

	return { data, isLoading, isSuccess }
}
