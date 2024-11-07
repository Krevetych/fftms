import { Pencil, Trash } from 'lucide-react'

import { RATE } from '@/constants/table.constants'

import { ERate, IPlan } from '@/types/plan.types'

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
		id: 4,
		title: 'Отработанные часы'
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
	},
	{
		id: 9,
		title: 'Действия'
	}
]

interface IProps {
	filteredPlans: IPlan[]
	handleModal: (type: 'create' | 'edit' | 'delete' | null, plan?: any) => void
}

export function PlansTable({ handleModal, filteredPlans }: IProps) {
	return (
		<>
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
					{filteredPlans.map(plan => (
						<tr key={plan.id}>
							<td className='p-2 border-b border-gray-700'>{plan.year}</td>
							<td className='p-2 border-b border-gray-700'>
								{RATE[plan.rate as ERate]}
							</td>
							<td className='p-2 border-b border-gray-700'>{plan.maxHours}</td>
							<td className='p-2 border-b border-gray-700'>{plan.worked}</td>
							<td className='p-2 border-b border-gray-700'>
								{plan.Object.name}
							</td>
							<td className='p-2 border-b border-gray-700'>
								{plan.teacher.fio}
							</td>
							<td className='p-2 border-b border-gray-700'>
								{plan.group.name}
							</td>
							<td className='p-2 border-b border-gray-700'>
								<div className='flex gap-2'>
									<Pencil
										size={20}
										onClick={() => handleModal('edit', plan)}
										className='cursor-pointer text-secondary hover:text-secondary/80'
									/>
									<Trash
										size={20}
										onClick={() => handleModal('delete', plan)}
										className='cursor-pointer text-red-500 hover:text-red-700'
									/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}
