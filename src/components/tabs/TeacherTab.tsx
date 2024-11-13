import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCcw, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { ITeacherD } from '@/types/teacher.types'

import Loader from '../Loader'
import NotFoundData from '../NotFoundData'
import { Button } from '../dashboard-layout/Button'

import { teacherService } from '@/services/teacher.service'

export function TeacherTab({
	data,
	isLoading
}: {
	data: ITeacherD[] | undefined
	isLoading: boolean
}) {
	const [open, setOpen] = useState(false)

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['force-delete-teacher'],
		mutationFn: (id: string) => {
			return teacherService.forceDelete(id)
		},
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
			queryClient.invalidateQueries({ queryKey: ['t-archive'] })
		}
	})

	const { mutate: restore } = useMutation({
		mutationKey: ['restore-teacher'],
		mutationFn: (id: string) => {
			return teacherService.restore(id)
		},
		onSuccess: () => {
			toast.success('Запись восстановлена')
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
			queryClient.invalidateQueries({ queryKey: ['t-archive'] })
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
					{data?.map(teacher => (
						<>
							<tbody>
								<tr key={teacher.id}>
									<td className='p-2 border-b border-gray-700'>
										{teacher.fio}
									</td>
									<td className='p-2 border-b border-gray-700'>
										<div className='flex gap-x-2'>
											<RefreshCcw
												size={20}
												className='cursor-pointer text-secondary hover:text-secondary/80'
												onClick={() => restore(teacher.id)}
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
											<h1 className='text-2xl font-black'>
												Удаление преподавателя
											</h1>
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
												onClick={() => mutate(teacher.id)}
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
