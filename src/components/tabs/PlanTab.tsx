import { RATE } from '@/constants/table.constants'

import { ERate, IPlanD } from '@/types/plan.types'

import Loader from '../Loader'
import NotFoundData from '../NotFoundData'

const MENU = [
	{
		id: 1,
		title: 'Учебный год'
	},
	{
		id: 2,
		title: 'Тариф'
	},
	{
		id: 3,
		title: 'Макс. кол-во часов'
	},
	{
		id: 5,
		title: 'Предмет'
	},
	{
		id: 6,
		title: 'Преподаватель'
	},

	{
		id: 7,
		title: 'Группа'
	}
]

export function PlanTab({
	data,
	isLoading
}: {
	data: IPlanD[] | undefined
	isLoading: boolean
}) {
	return (
		<>
			{isLoading ? (
				<Loader />
			) : data?.length === 0 ? (
				<NotFoundData />
			) : (
				<table className='w-full mt-4 border-collapse '>
					<thead className='whitespace-nowrap'>
						<tr>
							{MENU.map(menu => (
								<th
									className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'
									key={menu.id}
								>
									{menu.title}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map(plan => (
							<tr key={plan.id}>
								<td className='p-2 border-b border-gray-700'>{plan.year}</td>
								<td className='p-2 border-b border-gray-700'>
									{RATE[plan.rate as ERate]}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.maxHours}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.Object.name}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.teacher.fio}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.group.name}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	)
}
