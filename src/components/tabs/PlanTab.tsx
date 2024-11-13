import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCcw, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { RATE } from '@/constants/table.constants'

import { ERate, IPlanD } from '@/types/plan.types'

import Loader from '../Loader'
import NotFoundData from '../NotFoundData'
import { Button } from '../dashboard-layout/Button'

import { planService } from '@/services/plan.service'

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
		title: 'Предмет'
	},
	{
		id: 5,
		title: 'Преподаватель'
	},
	{
		id: 6,
		title: 'Группа'
	},
	{
		id: 7,
		title: 'Действия'
	}
]

export function PlanTab({
	data,
	isLoading
}: {
	data: IPlanD[] | undefined
	isLoading: boolean
}) {
	const [open, setOpen] = useState(false)

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['force-delete-plan'],
		mutationFn: (id: string) => {
			return planService.forceDelete(id)
		},
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['plans'] })
			queryClient.invalidateQueries({ queryKey: ['p-archive'] })
		}
	})

	const { mutate: restore } = useMutation({
		mutationKey: ['restore-plan'],
		mutationFn: (id: string) => {
			return planService.restore(id)
		},
		onSuccess: () => {
			toast.success('Запись восстановлена')
			queryClient.invalidateQueries({ queryKey: ['plans'] })
			queryClient.invalidateQueries({ queryKey: ['p-archive'] })
		}
	})

	return (
		<>
			{isLoading ? (
				<Loader />
			) : data?.length === 0 ? (
				<NotFoundData />
			) : (
				<table
					className='w-full mt-4 border-collapse'
				>
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
					{data?.map(plan => (
						<>
							<tbody>
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
									<td className='p-2 border-b border-gray-700'>
										<div className='flex gap-x-2'>
											<RefreshCcw
												size={20}
												className='cursor-pointer text-secondary hover:text-secondary/80'
												onClick={() => restore(plan.id)}
											/>
											<Trash
												size={20}
												className='cursor-pointer text-red-500 hover:text-red-700'
												onClick={() => setOpen(true)}
											/>
										</div>
									</td>
								</tr>
							</tbody>
							{open && (
								<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
									<div className='flex flex-col gap-2 bg-bg p-4 rounded-lg shadow-lg'>
										<div className='flex items-center justify-between gap-x-10'>
											<h1 className='text-2xl font-black'>Удаление плана</h1>
										</div>
										<p>
											Вы уверены, что хотите удалить запись? <br />
											<span className='text-red-500 font-semibold'>
												После удаления ее нельзя будет восстановить
											</span>
										</p>
										<div className='flex gap-x-2'>
											<Button
												type='button'
												extra='w-fit p-2 transition-colors border-red-500 rounded-lg border-solid border hover:border-red-400'
												onClick={() => mutate(plan.id)}
											>
												Удалить
											</Button>
											<Button
												type='button'
												extra='w-fit p-2 transition-colors bg-green-500 rounded-lg hover:bg-green-400'
												onClick={() => setOpen(false)}
											>
												Отмена
											</Button>
										</div>
									</div>
								</div>
							)}
						</>
					))}
				</table>
			)}
		</>
	)
}
