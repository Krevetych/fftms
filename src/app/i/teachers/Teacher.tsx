'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'

import { ITeacherCreate } from '@/types/teacher.types'

import { teacherService } from '@/services/teacher.service'

export function Teachers() {
	const { register, handleSubmit, reset } = useForm<ITeacherCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['teachers-create'],
		mutationFn: (data: ITeacherCreate) => {
			return teacherService.create(data)
		},
		onSuccess: () => {
			toast.success('Преподаватель создан')
			reset()
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
		}
	})

	const onSubmit: SubmitHandler<ITeacherCreate> = data => {
		mutate(data)
		setModal(false)
	}

	const handleModal = () => {
		setModal(!modal)
	}

	const { data, isLoading } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => {
			return teacherService.getAll()
		}
	})

	return (
		<>
			<div
				className='flex items-center gap-2 p-3 bg-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary/80'
				onClick={() => handleModal()}
			>
				<Plus />
				<p>Создать</p>
			</div>
			{modal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-bg p-4 rounded-lg shadow-lg'>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='flex flex-col gap-4'
						>
							<div className='flex items-center gap-x-4'>
								<h1 className='text-2xl font-black'>Создание преподавателя</h1>
								<X
									size={24}
									onClick={() => setModal(false)}
									className='rounded-full transition-colors cursor-pointer hover:bg-primary'
								/>
							</div>
							<div className='flex flex-col gap-2'>
								<input
									{...register('fio', { required: true })}
									type='text'
									placeholder='ФИО'
									className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
								/>
							</div>
							<button
								type='submit'
								className='w-fit p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
							>
								Создать
							</button>
						</form>
					</div>
				</div>
			)}
			{isLoading ? (
				<Loader />
			) : data?.length != 0 && data ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700'>ФИО</th>
						</tr>
					</thead>
					<tbody>
						{data.map(teacher => (
							<tr key={teacher.id}>
								<td className='p-2 border-b border-gray-700'>{teacher.fio}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
