import { useState } from 'react'

import { COURSE, GROUP, TYPE } from '@/constants/table.constants'

import { ECourse, EType, IGroupD } from '@/types/group.types'

import Loader from '../Loader'
import NotFoundData from '../NotFoundData'

export function GroupTab({
	data,
	isLoading
}: {
	data: IGroupD[] | undefined
	isLoading: boolean
}) {
	return (
		<>
			{isLoading ? (
				<Loader />
			) : data?.length === 0 ? (
				<NotFoundData />
			) : (
				<table className='w-full mt-4 border-collapse'>
					<thead className='whitespace-nowrap'>
						<tr>
							{GROUP.map(group => (
								<th
									className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'
									key={group.id}
								>
									{group.title}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map(group => (
							<tr key={group.id}>
								<td className='p-2 border-b border-gray-700'>{group.name}</td>
								<td className='p-2 border-b border-gray-700'>
									{COURSE[group.course as ECourse]}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{TYPE[group.type as EType]}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	)
}
