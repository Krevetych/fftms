import { Pencil, Trash } from 'lucide-react'

import { ITeacher } from '@/types/teacher.types'

interface IProps {
	filteredTeachers: ITeacher[]
	handleModal: (
		type: 'create' | 'edit' | 'delete' | null,
		teacher?: ITeacher
	) => void
}

export function TeachersTable({ filteredTeachers, handleModal }: IProps) {
	return (
		<table className='w-full mt-4 border-collapse'>
			<thead>
				<tr>
					<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
						ФИО
					</th>
					<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
						Действия
					</th>
				</tr>
			</thead>
			<tbody>
				{filteredTeachers.map((teacher: ITeacher) => (
					<tr key={teacher.id}>
						<td className='p-2 border-b border-gray-700'>{teacher.fio}</td>
						<td className='p-2 border-b border-gray-700'>
							<div className='flex gap-x-2'>
								<Pencil
									size={20}
									className='cursor-pointer text-secondary hover:text-secondary/80'
									onClick={() => handleModal('edit', teacher)}
								/>
								<Trash
									size={20}
									className='cursor-pointer text-red-500 hover:text-red-700'
									onClick={() => handleModal('delete', teacher)}
								/>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
