'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Pencil, Plus, Trash, Upload, X } from 'lucide-react'
import { type } from 'os'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import style from 'styled-jsx/style'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'

import { IObject, IObjectCreate, IObjectUpdate } from '@/types/object.types'
import { ITeacher } from '@/types/teacher.types'

import { objectService } from '@/services/object.service'

export function Object() {
	const { register, handleSubmit, reset, setValue } = useForm<IObjectCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [importModal, setImportModal] = useState(false)
	const [selectedObject, setSelectedObject] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

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
			toast.success(`Запись ${actionType === 'edit' ? 'обновлена' : 'создана'}`)
			reset()
			setSelectedObject(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['objects'] })
			setModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message
			if (errorMessage === 'Object already exists') {
				toast.error('Предмет уже существует')
			}
		}
	})

	const { mutate: deleteObject } = useMutation({
		mutationKey: ['objects-delete'],
		mutationFn: (id: string) => objectService.delete(id),
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['objects'] })
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message
			if (errorMessage === 'Object has related records') {
				toast.warning('Запись имеет связь с учебным планом')
			}
		}
	})

	const { mutate: importObjects, isPending } = useMutation({
		mutationKey: ['objects-import'],
		mutationFn: (data: FormData) => objectService.upload(data),
		onSuccess: () => {
			toast.success('Записи импортированы')
			queryClient.invalidateQueries({ queryKey: ['objects'] })
			setImportModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === "Can't create object") {
				toast.error(
					'Возникла ошибка при импорте данных из файла, сравните структуру файла с примером и повторите попытку'
				)
			}
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

	const handleImportModal = () => {
		setImportModal(!importModal)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const formData = new FormData()
			formData.append('file', file)
			importObjects(formData)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['objects'],
		queryFn: () => {
			return objectService.getAll()
		}
	})

	const filteredObject = data?.filter((object: IObject) =>
		object.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<div className='flex items-center justify-between'>
				<div className='flex gap-x-2'>
					<div
						className='flex items-center gap-2 p-3 bg-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary/80'
						onClick={() => handleModal('create')}
					>
						<Plus />
						<p>Создать</p>
					</div>
					<div
						className='flex items-center gap-2 p-3 border borde-solid border-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary'
						onClick={handleImportModal}
					>
						<Upload />
						<p>Импортировать</p>
					</div>
				</div>

				<div className='flex gap-x-2 mb-4'>
					<input
						type='text'
						placeholder='Поиск по названию предмета'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-transparent border border-solid focus:border-primary text-ellipsis overflow-hidden whitespace-nowrap'
						style={{ maxWidth: '100%', overflow: 'hidden' }}
					/>
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

			{importModal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-bg p-4 rounded-lg shadow-lg'>
						<div className='flex items-center justify-between'>
							<h1 className='text-2xl font-black'>Импорт данных</h1>
							<X
								size={24}
								onClick={() => setImportModal(false)}
								className='rounded-full transition-colors cursor-pointer hover:bg-primary'
							/>
						</div>
						<div className='flex flex-col gap-4 mt-4'>
							<input
								type='file'
								accept='.xlsx,.xls'
								onChange={handleFileChange}
								className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
							/>
							{isPending && <Loader />}
						</div>
					</div>
				</div>
			)}

			{isLoading ? (
				<Loader />
			) : filteredObject?.length !== 0 && filteredObject ? (
				<div className='overflow-x-auto'>
					<div className='overflow-y-auto max-h-[75vh]'>
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
										<td className='p-2 border-b border-gray-700'>
											{object.name}
										</td>
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
					</div>
				</div>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
