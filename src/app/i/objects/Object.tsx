'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'

import { IObjectCreate } from '@/types/object.types'

import { objectService } from '@/services/object.service'

export function Object() {
	const { register, handleSubmit, reset } = useForm<IObjectCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['objects-create'],
		mutationFn: (data: IObjectCreate) => {
			return objectService.create(data)
		},
		onSuccess: () => {
			toast.success('Предмет создан')
			reset()
			queryClient.invalidateQueries({ queryKey: ['objects'] })
		}
	})

	const { data, isLoading } = useQuery({
		queryKey: ['objects'],
		queryFn: () => {
			return objectService.getAll()
		}
	})

	const handleModal = () => {
		setModal(!modal)
	}

	const onSubmit: SubmitHandler<IObjectCreate> = data => {
		mutate(data)
		setModal(false)
	}

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
								<h1 className='text-2xl font-black'>Создание предмета</h1>
								<X
									size={24}
									onClick={() => setModal(false)}
									className='rounded-full transition-colors cursor-pointer hover:bg-primary'
								/>
							</div>
							<div className='flex flex-col gap-2'>
								<input
									{...register('name', { required: true })}
									type='text'
									placeholder='Название'
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
							<th className='text-left p-2 border-b border-gray-700'>ID</th>
							<th className='text-left p-2 border-b border-gray-700'>NAME</th>
						</tr>
					</thead>
					<tbody>
						{data.map(object => (
							<tr key={object.id}>
								<td className='p-2 border-b border-gray-700'>
									{`${object.id.slice(0, 5)}...`}
								</td>
								<td className='p-2 border-b border-gray-700'>{object.name}</td>
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
