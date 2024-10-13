'use client'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'

import { userService } from '@/services/user.service'

export function Users() {
	const { data, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: () => {
			return userService.getAll()
		}
	})

	return (
		<>
			{isLoading ? (
				<Loader />
			) : data?.length != 0 && data ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700'>ID</th>
							<th className='text-left p-2 border-b border-gray-700'>LOGIN</th>
							<th className='text-left p-2 border-b border-gray-700'>
								IS_ADMIN
							</th>
						</tr>
					</thead>
					<tbody>
						{data.map(user => (
							<tr key={user.id}>
								<td className='p-2 border-b border-gray-700'>
									{`${user.id.slice(0, 5)}...`}
								</td>
								<td className='p-2 border-b border-gray-700'>{user.login}</td>
								<td className='p-2 border-b border-gray-700 text-center'>
									{user.isAdmin ? (
										<p className='w-10 h-4 bg-green-500 rounded-full'></p>
									) : (
										<p className='text-center w-10 h-4 bg-red-500 rounded-full'></p>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
