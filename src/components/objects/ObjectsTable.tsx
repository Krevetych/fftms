import { Pencil, Trash } from 'lucide-react'

import { IObject } from '@/types/object.types'

interface IProps {
	handleModal: (type: 'create' | 'edit' | 'delete' | null, object?: any) => void
	filteredObject: IObject[]
}

export function ObjectsTable({ handleModal, filteredObject }: IProps) {
	return (
		<table className='w-full mt-4 border-collapse'>
			<thead>
				<tr>
					<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
						Название предмета
					</th>
					<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
						Действия
					</th>
				</tr>
			</thead>
			<tbody>
				{filteredObject.map(object => (
					<tr key={object.id}>
						<td className='p-2 border-b border-gray-700'>{object.name}</td>
						<td className='p-2 border-b border-gray-700'>
							<div className='flex gap-x-2'>
								<Pencil
									size={20}
									className='cursor-pointer text-secondary hover:text-secondary/80'
									onClick={() => handleModal('edit', object)}
								/>
								<Trash
									size={20}
									className='cursor-pointer text-red-500 hover:text-red-700'
									onClick={() => handleModal('delete', object)}
								/>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
