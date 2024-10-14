'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'

import { IObjectCreate, IObjectUpdate } from '@/types/object.types'

import { objectService } from '@/services/object.service'

export function Object() {
	const { register, handleSubmit, reset, setValue } = useForm<IObjectCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [selectedObject, setSelectedObject] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const queryClient = useQueryClient()

	const { mutate: createOrEditObject } = useMutation({
		mutationKey: ['objects-create-edit'],
		mutationFn: (data: IObjectCreate | IObjectUpdate) => {
			if (selectedObject) {
				return objectService.update(selectedObject.id, data as IObjectUpdate)
			}
			return objectService.create(data as IObjectCreate)
		},
		onSuccess: () => {
			toast.success(`Предмет ${actionType === 'edit' ? 'обновлён' : 'создан'}`)
			reset()
			setSelectedObject(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['objects'] })
			setModal(false)
		}
	})

	const { mutate: deleteObject } = useMutation({
		mutationKey: ['objects-delete'],
		mutationFn: (id: string) => objectService.delete(id),
		onSuccess: () => {
			toast.success('Предмет удалён')
			queryClient.invalidateQueries({ queryKey: ['objects'] })
		}
	})

	const onSubmit: SubmitHandler<IObjectCreate> = data => {
		if (actionType === 'edit') {
			createOrEditObject(data)
		} else {
			createOrEditObject(data)
		}
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		object?: any
	) => {
		if (type === 'edit' && object) {
			setSelectedObject(object)
			setValue('name', object.name)
		} else if (type === 'delete' && object) {
			setSelectedObject(object)
		} else {
			reset()
			setSelectedObject(null)
		}
		setActionType(type)
		setModal(!modal)
	}

	const { data, isLoading } = useQuery({
		queryKey: ['objects'],
		queryFn: () => {
			return objectService.getAll()
		}
	})

	return (
		<>
			<div className='flex items-center gap-2'>
				<div
					className='flex items-center gap-2 p-3 bg-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary/80'
					onClick={() => handleModal('create')}
				>
					<Plus />
					<p>Создать</p>
				</div>
			</div>

			{modal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-bg p-4 rounded-lg shadow-lg'>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='flex flex-col gap-4'
						>
							<div className='flex items-center gap-x-4'>
								<h1 className='text-2xl font-black'>
									{actionType === 'edit'
										? 'Редактирование предмета'
										: actionType === 'delete'
											? 'Удаление предмета'
											: 'Создание предмета'}
								</h1>
								<X
									size={24}
									onClick={() => setModal(false)}
									className='rounded-full transition-colors cursor-pointer hover:bg-primary'
								/>
							</div>

							{actionType !== 'delete' ? (
								<>
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
										{actionType === 'edit' ? 'Сохранить изменения' : 'Создать'}
									</button>
								</>
							) : (
								<div className='flex flex-col gap-2'>
									<p>
										Вы уверены, что хотите удалить предмет{' '}
										<strong>{selectedObject?.name}</strong>?
									</p>
									<button
										type='button'
										className='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
										onClick={() => {
											if (selectedObject) {
												deleteObject(selectedObject.id)
												setModal(false)
											}
										}}
									>
										Удалить
									</button>
								</div>
							)}
						</form>
					</div>
				</div>
			)}

			{isLoading ? (
				<Loader />
			) : data?.length !== 0 && data ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700'>
								Название предмета
							</th>
							<th className='text-left p-2 border-b border-gray-700'>
								Действия
							</th>
						</tr>
					</thead>
					<tbody>
						{data.map(object => (
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
			) : (
				<NotFoundData />
			)}
		</>
	)
}
