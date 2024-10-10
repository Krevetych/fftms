'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { table } from 'console'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'

import { IAuthForm } from '@/types/auth.types'
import { ITeacherForm } from '@/types/teacher.types'

import { teacherService } from '@/services/teacher.service'

export function Teachers() {
	const { register, handleSubmit, reset } = useForm<ITeacherForm>({
		mode: 'onChange'
	})

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['teachers-create'],
		mutationFn: (data: ITeacherForm) => {
			return teacherService.create(data)
		},
		onSuccess: () => {
			toast.success('Преподаватель создан')
			reset()
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
		}
	})

	const onSubmit: SubmitHandler<ITeacherForm> = data => {
		mutate(data)
	}

	const { data, isLoading } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => {
			return teacherService.getAll()
		}
	})

	return (
		<>
			<form
				className='flex flex-col'
				onSubmit={handleSubmit(onSubmit)}
			>
				<input
					type='text'
					placeholder='ФИО'
					className='bg-card'
					{...register('fio', {
						required: 'Fio is required'
					})}
				/>
				<button type='submit'>создать</button>
			</form>
			{isLoading ? (
				<Loader />
			) : data?.length != 0 && data ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700'>ID</th>
							<th className='text-left p-2 border-b border-gray-700'>ФИО</th>
						</tr>
					</thead>
					<tbody>
						{data.map(teacher => (
							<tr key={teacher.id}>
								<td className='p-2 border-b border-gray-700'>
									{`${teacher.id.slice(0, 5)}...`}
								</td>
								<td className='p-2 border-b border-gray-700'>{teacher.fio}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>Нет преподавателей</p>
			)}
		</>
	)
}
