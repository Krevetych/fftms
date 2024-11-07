import { ITeacherD } from '@/types/teacher.types'

import Loader from '../Loader'
import NotFoundData from '../NotFoundData'

export function TeacherTab({
	data,
	isLoading
}: {
	data: ITeacherD[] | undefined
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
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								ФИО
							</th>
						</tr>
					</thead>
					<tbody>
						{data?.map(teacher => (
							<tr key={teacher.id}>
								<td className='p-2 border-b border-gray-700'>{teacher.fio}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	)
}
