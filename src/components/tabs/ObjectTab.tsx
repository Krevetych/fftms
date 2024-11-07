import { IObjectD } from '@/types/object.types'

import Loader from '../Loader'
import NotFoundData from '../NotFoundData'

export function ObjectTab({
	data,
	isLoading
}: {
	data: IObjectD[] | undefined
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
								Название предмета
							</th>
						</tr>
					</thead>
					<tbody>
						{data?.map(object => (
							<tr key={object.id}>
								<td className='p-2 border-b border-gray-700'>{object.name}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	)
}
