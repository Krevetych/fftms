'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Pencil, Plus, Trash, X } from 'lucide-react'
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
	const [filters, setFilters] = useState<IFilteredGroup>()
	const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const queryClient = useQueryClient()

	const { data: fGroupsData, isLoading: isLoadingFGroups } = useQuery({
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
		}
	})

	const { mutate: deleteGroup } = useMutation({
		mutationKey: ['groups-delete'],
		mutationFn: (id: string) => groupService.delete(id),
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['groups'] })
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
			setValue('status', group.status)
		} else if (type === 'delete' && group) {
			setSelectedGroup(group)
		} else {
			reset()
			setSelectedGroup(null)
		}
		setActionType(type)
		setModal(!modal)
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
	}

	return (
		<div className='flex justify-between'>
			<div className='w-2/3'>
				<div
					className='flex items-center gap-2 p-3 bg-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary/80'
					onClick={() => handleModal('create')}
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

												<select
													{...register('status', { required: true })}
													className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
												>
													<option
														value=''
														disabled
														selected
													>
														Выберите статус
													</option>
													{Object.entries(EStatus).map(([status, value]) => (
														<option
															key={status}
															value={status}
														>
															{GROUP_STATUS[value]}
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

				{isLoading ? (
					<Loader />
				) : mapData?.length !== 0 && mapData ? (
					<div className='overflow-x-auto'>
						<table className='w-full mt-4 border-collapse'>
							<thead className='whitespace-nowrap'>
								<tr>
									{GROUP.map(group => (
										<th
											className='text-left p-2 border-b border-gray-700'
											key={group.id}
										>
											{group.title}
										</th>
									))}
									<th className='text-left p-2 border-b border-gray-700'>
										Действия
									</th>
								</tr>
							</thead>
							<tbody>
								{mapData.map(group => (
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
				) : (
					<NotFoundData />
				)}
			</div>
			<div className='w-1/3 flex items-center justify-center'>
				<form
					onSubmit={filterHandleSubmit(onSubmitFiltered)}
					className='flex bg-card border border-primary rounded-2xl border-solid p-10 flex-col justify-center items-center w-fit'
				>
					<div>
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
					</div>
				</form>
			</div>
		</div>
	)
}
