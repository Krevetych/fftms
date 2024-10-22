'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Pencil, Plus, Trash, Upload, X } from 'lucide-react'
import { type } from 'os'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'

import { ITeacher, ITeacherCreate, ITeacherUpdate } from '@/types/teacher.types'

import { teacherService } from '@/services/teacher.service'

export function Teachers() {
	const { register, handleSubmit, reset, setValue } = useForm<ITeacherCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [importModal, setImportModal] = useState(false)
	const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const queryClient = useQueryClient()

	const { mutate: createOrEditTeacher } = useMutation({
		mutationKey: ['teachers-create-edit'],
		mutationFn: (data: ITeacherCreate | ITeacherUpdate) => {
			if (selectedTeacher) {
				return teacherService.update(selectedTeacher.id, data as ITeacherUpdate)
			}
			return teacherService.create(data as ITeacherCreate)
		},
		onSuccess: () => {
			toast.success(`Запись ${actionType === 'edit' ? 'обновлена' : 'создана'}`)
			reset()
			setSelectedTeacher(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
			setModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message
			if (errorMessage === 'Teacher already exists') {
				toast.error('Преподаватель уже существует')
			}
		}
	})

	const { mutate: deleteTeacher } = useMutation({
		mutationKey: ['teachers-delete'],
		mutationFn: (id: string) => teacherService.delete(id),
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Teacher has related records') {
				toast.warning('Запись имеет связь с учебным планом')
			}
		}
	})

	const { mutate: importTeachers, isPending } = useMutation({
		mutationKey: ['teachers-import'],
		mutationFn: (data: FormData) => teacherService.upload(data),
		onSuccess: () => {
			toast.success('Записи импортированы')
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
			setImportModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === "Can't create teacher") {
				toast.error(
					'Возникла ошибка при импорте данных из файла, сравните структуру файла с примером и повторите попытку'
				)
			}

			toast.warning(errorMessage)
		}
	})

	const onSubmit: SubmitHandler<ITeacherCreate> = data => {
		if (actionType === 'edit') {
			createOrEditTeacher(data)
		} else {
			createOrEditTeacher(data)
		}
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		teacher?: ITeacher
	) => {
		if (type === 'edit' && teacher) {
			setSelectedTeacher(teacher)
			setValue('fio', teacher.fio)
		} else if (type === 'delete' && teacher) {
			setSelectedTeacher(teacher)
		} else {
			reset()
			setSelectedTeacher(null)
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
			importTeachers(formData)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => teacherService.getAll()
	})

	const filteredTeachers = data?.filter((teacher: ITeacher) =>
		teacher.fio.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<div className='my-3 h-0.5 bg-primary w-full' />
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
						placeholder='Поиск по ФИО'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-transparent border border-solid focus:border-primary'
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
										? 'Редактирование преподавателя'
										: actionType === 'delete'
											? 'Удаление преподавателя'
											: 'Создание преподавателя'}
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
										{actionType === 'edit' ? 'Сохранить изменения' : 'Создать'}
									</button>
								</>
							) : (
								<div className='flex flex-col gap-2'>
									<p>
										Вы уверены, что хотите удалить преподавателя{' '}
										{selectedTeacher?.fio}?
									</p>
									<button
										type='button'
										className='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
										onClick={() => {
											if (selectedTeacher) {
												deleteTeacher(selectedTeacher.id)
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
			) : filteredTeachers?.length !== 0 && filteredTeachers ? (
				<div className='overflow-x-auto'>
					<div className='overflow-y-auto max-h-[75vh]'>
						<table className='w-full mt-4 border-collapse'>
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
							<tbody>
								{filteredTeachers.map((teacher: ITeacher) => (
									<tr key={teacher.id}>
										<td className='p-2 border-b border-gray-700'>
											{teacher.fio}
										</td>
										<td className='p-2 border-b border-gray-700'>
											<div className='flex gap-x-2'>
												<Pencil
													size={20}
													className='cursor-pointer text-secondary hover:text-secondary/80'
													onClick={() => handleModal('edit', teacher)}
												/>
												<Trash
													size={20}
													className='cursor-pointer text-red-500 hover:text-red-700'
													onClick={() => handleModal('delete', teacher)}
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
