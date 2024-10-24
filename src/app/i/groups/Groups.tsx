'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Loader, Pencil, Plus, Trash, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'
import SelectInput from '@/components/SelectInput'

import { COURSE, GROUP, GROUP_STATUS, TYPE } from '@/constants/table.constants'

import {
	ECourse,
	EStatus,
	EType,
	IFilteredGroup,
	IGroup,
	IGroupCreate,
	IGroupUpdate
} from '@/types/group.types'

import { groupService } from '@/services/group.service'

export interface ISubjectForm {
	type: EType
	course: ECourse
	status: EStatus
}

export function Groups() {
	const { register, handleSubmit, reset, setValue } = useForm<IGroupCreate>({
		mode: 'onChange'
	})

	const {
		register: filterRegister,
		handleSubmit: filterHandleSubmit,
		reset: filterReset
	} = useForm<ISubjectForm>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [filters, setFilters] = useState<IFilteredGroup | undefined>()
	const [importModal, setImportModal] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const queryClient = useQueryClient()

	const { data: fGroupsData } = useQuery({
		queryKey: ['filtered-groups', filters],
		queryFn: () => (filters ? groupService.getFiltered(filters) : []),
		enabled: !!filters
	})

	const { mutate: createOrEditGroup } = useMutation({
		mutationKey: ['groups-create-edit'],
		mutationFn: (data: IGroupCreate | IGroupUpdate) => {
			if (selectedGroup) {
				return groupService.update(selectedGroup.id, data as IGroupUpdate)
			}
			return groupService.create(data as IGroupCreate)
		},
		onSuccess: () => {
			toast.success(`Запись ${actionType === 'edit' ? 'обновлена' : 'создана'}`)
			reset()
			setSelectedGroup(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['groups'] })
			setModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Group already exists') {
				toast.error('Группа уже существует')
			}
		}
	})

	const { mutate: deleteGroup } = useMutation({
		mutationKey: ['groups-delete'],
		mutationFn: (id: string) => groupService.delete(id),
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['groups'] })
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Group has related records') {
				toast.warning('Запись имеет связь с учебным планом')
			}
		}
	})

	const { mutate: importGroups, isPending } = useMutation({
		mutationKey: ['groups-import'],
		mutationFn: (data: FormData) => groupService.upload(data),
		onSuccess: () => {
			toast.success('Записи импортированы')
			queryClient.invalidateQueries({ queryKey: ['groups'] })
			setImportModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === "Can't create group") {
				toast.error(
					'Возникла ошибка при импорте данных из файла, сравните структуру файла с примером и повторите попытку'
				)
			}

			toast.warning(errorMessage)
		}
	})

	const onSubmit: SubmitHandler<IGroupCreate> = data => {
		if (actionType === 'edit') {
			createOrEditGroup(data)
		} else {
			createOrEditGroup(data)
		}
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		group?: any
	) => {
		if (type === 'edit' && group) {
			setSelectedGroup(group)
			setValue('name', group.name)
			setValue('type', group.type)
			setValue('course', group.course)
		} else if (type === 'delete' && group) {
			setSelectedGroup(group)
		} else {
			reset()
			setSelectedGroup(null)
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
			importGroups(formData)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['groups'],
		queryFn: () => {
			return groupService.getAll()
		}
	})

	const onSubmitFiltered: SubmitHandler<ISubjectForm> = data => {
		setFilters({
			type: data.type || '',
			course: data.course || '',
			status: data.status || ''
		})
	}

	const mapData =
		fGroupsData && fGroupsData?.length > 0 && filters
			? fGroupsData
			: fGroupsData?.length === 0 && filters
				? []
				: data

	const resetFilters = () => {
		filterReset()
		setFilters(undefined)
	}

	const filteredGroups = mapData?.filter((group: IGroup) =>
		group.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<form
				onSubmit={filterHandleSubmit(onSubmitFiltered)}
				className='flex bg-card justify-between gap-x-10 items-center w-fit mx-5 mt-5'
			>
				<SelectInput
					label='Тип группы'
					options={Object.entries(TYPE).map(([type, value]) => ({
						value: type as EType,
						label: value
					}))}
					{...filterRegister('type')}
				/>
				<SelectInput
					label='Курс'
					options={Object.entries(COURSE).map(([course, value]) => ({
						value: course as ECourse,
						label: value
					}))}
					{...filterRegister('course')}
				/>
				<SelectInput
					label='Статус'
					options={Object.entries(GROUP_STATUS).map(([status, value]) => ({
						value: status as EStatus,
						label: value
					}))}
					{...filterRegister('status')}
				/>
				<div className='flex gap-x-2'>
					<button
						type='submit'
						className='w-full p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
					>
						Применить
					</button>
					<button
						type='button'
						onClick={resetFilters}
						className='w-full p-2 transition-colors bg-secondary rounded-lg hover:bg-secondary/80'
					>
						Сбросить
					</button>
				</div>
			</form>

			<div className='my-3 h-0.5 bg-primary w-full' />

			<div className='flex justify-between overflow-y-hidden'>
				<div className='w-full'>
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
								placeholder='Поиск по названию группы'
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
									<div className='flex items-center justify-between'>
										<h1 className='text-2xl font-black'>
											{actionType === 'edit'
												? 'Редактирование группы'
												: actionType === 'delete'
													? 'Удаление группы'
													: 'Создание группы'}
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
													placeholder='Группа'
													className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
												/>
												<div className='flex flex-col gap-y-2'>
													<select
														{...register('course', { required: true })}
														className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
													>
														<option
															value=''
															disabled
															selected
														>
															Выберите курс
														</option>
														{Object.entries(ECourse).map(([course, value]) => (
															<option
																key={course}
																value={course}
															>
																{COURSE[value]}
															</option>
														))}
													</select>

													<select
														{...register('type', { required: true })}
														className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
													>
														<option
															value=''
															disabled
															selected
														>
															Выберите тип
														</option>
														{Object.entries(EType).map(([type, value]) => (
															<option
																key={type}
																value={type}
															>
																{TYPE[value]}
															</option>
														))}
													</select>
												</div>
											</div>
											<button
												type='submit'
												className='w-fit p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
											>
												{actionType === 'edit'
													? 'Сохранить изменения'
													: 'Создать'}
											</button>
										</>
									) : (
										<div className='flex flex-col gap-2'>
											<p>
												Вы уверены, что хотите удалить группу{' '}
												<strong>{selectedGroup?.name}</strong>?
											</p>
											<button
												type='button'
												className='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
												onClick={() => {
													if (selectedGroup) {
														deleteGroup(selectedGroup.id)
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
					) : filteredGroups?.length !== 0 && filteredGroups ? (
						<div className='overflow-x-auto'>
							<div className='overflow-y-auto max-h-[70vh]'>
								<table className='w-full mt-4 border-collapse'>
									<thead className='whitespace-nowrap'>
										<tr>
											{GROUP.map(group => (
												<th
													className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'
													key={group.id}
												>
													{group.title}
												</th>
											))}
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Действия
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredGroups.map(group => (
											<tr key={group.id}>
												<td className='p-2 border-b border-gray-700'>
													{group.name}
												</td>
												<td className='p-2 border-b border-gray-700'>
													{COURSE[group.course as ECourse]}
												</td>
												<td className='p-2 border-b border-gray-700'>
													{TYPE[group.type as EType]}
												</td>
												<td className='p-2 border-b border-gray-700'>
													{group.status === EStatus.ACTIVE ? (
														<div className='h-5 w-10 bg-primary rounded-full'></div>
													) : (
														<div className='h-5 w-10 bg-red-500 rounded-full'></div>
													)}
												</td>
												<td className='p-2 border-b border-gray-700'>
													<div className='flex gap-x-2'>
														<Pencil
															size={20}
															className='cursor-pointer text-secondary hover:text-secondary/80'
															onClick={() => handleModal('edit', group)}
														/>
														<Trash
															size={20}
															className='cursor-pointer text-red-500 hover:text-red-700'
															onClick={() => handleModal('delete', group)}
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
				</div>
			</div>
		</>
	)
}
