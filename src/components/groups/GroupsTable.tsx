import { Pencil, Trash } from 'lucide-react'

import { COURSE, GROUP, TYPE } from '@/constants/table.constants'

import { ECourse, EType, IGroup } from '@/types/group.types'

interface IProps {
	handleModal: (type: 'create' | 'edit' | 'delete' | null, group?: any) => void
	filteredGroups: IGroup[]
}

export function GroupsTable({ handleModal, filteredGroups }: IProps) {
	return (
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
					<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
						Действия
					</th>
				</tr>
			</thead>
			<tbody>
				{filteredGroups.map(group => (
					<tr key={group.id}>
						<td className='p-2 border-b border-gray-700'>{group.name}</td>
						<td className='p-2 border-b border-gray-700'>
							{COURSE[group.course as ECourse]}
						</td>
						<td className='p-2 border-b border-gray-700'>
							{TYPE[group.type as EType]}
						</td>

						<td className='p-2 border-b border-gray-700'>
							<div className='flex gap-x-2'>
								<Pencil
									size={20}
									className='cursor-pointer text-secondary hover:text-secondary/80'
									onClick={() => handleModal('edit', group)}
								/>
								<Trash
									size={20}
									className='cursor-pointer text-red-500 hover:text-red-700'
									onClick={() => handleModal('delete', group)}
								/>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
