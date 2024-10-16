'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'

import { GROUP_STATUS, PLAN_STATUS, RATE } from '@/constants/table.constants'

import { EStatus } from '@/types/group.types'
import { ERate, IPlanCreate, IPlanUpdate } from '@/types/plan.types'

import { groupService } from '@/services/group.service'
import { objectService } from '@/services/object.service'
import { planService } from '@/services/plan.service'
import { teacherService } from '@/services/teacher.service'

export function Plans() {
	const { register, handleSubmit, reset, setValue } = useForm<IPlanCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const queryClient = useQueryClient()

	const { mutate: createOrEditPlan } = useMutation({
		mutationKey: ['plans-create-edit'],
		mutationFn: (data: IPlanCreate | IPlanUpdate) => {
			if (selectedPlan) {
				return planService.update(selectedPlan.id, data as IPlanUpdate)
			}
			return planService.create(data as IPlanCreate)
		},
		onSuccess: () => {
			toast.success(`Запись ${actionType === 'edit' ? 'обновлена' : 'создана'}`)
			reset()
			setSelectedPlan(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['plans'] })
			setModal(false)
		}
	})

	const { mutate: deletePlan } = useMutation({
		mutationKey: ['plans-delete'],
		mutationFn: (id: string) => planService.delete(id),
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['plans'] })
		}
	})

	const onSubmit: SubmitHandler<IPlanCreate> = data => {
		createOrEditPlan(data)
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		plan?: any
	) => {
		if (type === 'edit' && plan) {
			setSelectedPlan(plan)
			setValue('year', plan.year)
			setValue('rate', plan.rate)
			setValue('maxHours', plan.maxHours)
			setValue('status', plan.status)
			setValue('objectId', plan.objectId)
			setValue('teacherId', plan.teacherId)
			setValue('groupId', plan.groupId)
		} else if (type === 'delete' && plan) {
			setSelectedPlan(plan)
		} else {
			reset()
			setSelectedPlan(null)
		}
		setActionType(type)
		setModal(!modal)
	}

	const { data, isLoading } = useQuery({
		queryKey: ['plans'],
		queryFn: () => planService.getAll()
	})

	const { data: objectsData, isLoading: isLoadingObjects } = useQuery({
		queryKey: ['objects'],
		queryFn: () => objectService.getAll()
	})

	const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => teacherService.getAll()
	})

	const { data: groupData, isLoading: isLoadingGroups } = useQuery({
		queryKey: ['groups'],
		queryFn: () => groupService.getAll()
	})

	const year = () => {
		const year = new Date().getFullYear()
		return `${year}-${year + 1}`
	}

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
										? 'Редактирование учебного плана'
										: actionType === 'delete'
											? 'Удаление учебного плана'
											: 'Создание учебного плана'}
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
											{...register('year', { required: true })}
											type='text'
											placeholder='Учебный год'
											value={year()}
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										/>
										<select
											{...register('rate', { required: true })}
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										>
											<option
												value=''
												disabled
												selected
											>
												Выберите тариф
											</option>
											{Object.entries(ERate).map(([rate, value]) => (
												<option
													key={rate}
													value={rate}
												>
													{RATE[value]}
												</option>
											))}
										</select>
										<input
											{...register('maxHours', { required: true })}
											type='text'
											placeholder='Макс. кол-во часов'
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										/>
										<select
											{...register('objectId', { required: true })}
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										>
											<option
												value=''
												disabled
												selected
											>
												Выберите предмет
											</option>
											{isLoadingObjects ? (
												<Loader />
											) : (
												objectsData?.map(object => (
													<option
														key={object.id}
														value={object.id}
													>
														{object.name}
													</option>
												))
											)}
										</select>
										<select
											{...register('teacherId', { required: true })}
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										>
											<option
												value=''
												disabled
												selected
											>
												Выберите преподавателя
											</option>
											{isLoadingTeachers ? (
												<Loader />
											) : (
												teachersData?.map(teacher => (
													<option
														key={teacher.id}
														value={teacher.id}
													>
														{teacher.fio}
													</option>
												))
											)}
										</select>
										<select
											{...register('groupId', { required: true })}
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										>
											<option
												value=''
												disabled
												selected
											>
												Выберите группу
											</option>
											{isLoadingGroups ? (
												<Loader />
											) : (
												groupData?.map(group => (
													<option
														key={group.id}
														value={group.id}
													>
														{group.name}
													</option>
												))
											)}
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
													{PLAN_STATUS[value]}
												</option>
											))}
										</select>
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
										Вы уверены, что хотите удалить план{' '}
										<strong>{selectedPlan?.year}</strong>?
									</p>
									<button
										type='button'
										className='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
										onClick={() => {
											if (selectedPlan) {
												deletePlan(selectedPlan.id)
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
				<div className='overflow-x-auto'>
					<table className='w-full mt-4 border-collapse '>
						<thead className='whitespace-nowrap'>
							<tr>
								<th className='text-left p-2 border-b border-gray-700'>
									Учебный год
								</th>
								<th className='text-left p-2 border-b border-gray-700'>
									Тариф
								</th>
								<th className='text-left p-2 border-b border-gray-700'>
									Макс. кол-во часов
								</th>
								<th className='text-left p-2 border-b border-gray-700'>
									Отработанные часы
								</th>
								<th className='text-left p-2 border-b border-gray-700'>
									Предмет
								</th>
								<th className='text-left p-2 border-b border-gray-700'>
									Преподаватель
								</th>
								<th className='text-left p-2 border-b border-gray-700'>
									Группа
								</th>
								<th className='text-left p-2 border-b border-gray-700'>
									Статус
								</th>
								<th className='text-left p-2 border-b border-gray-700'>
									Действия
								</th>
							</tr>
						</thead>
						<tbody>
							{data.map(plan => (
								<tr key={plan.id}>
									<td className='p-2 border-b border-gray-700'>{plan.year}</td>
									<td className='p-2 border-b border-gray-700'>
										{RATE[plan.rate as ERate]}
									</td>
									<td className='p-2 border-b border-gray-700'>
										{plan.maxHours}
									</td>
									<td className='p-2 border-b border-gray-700'>
										{plan.worked}
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
										{plan.status === EStatus.ACTIVE ? (
											<div className='h-5 w-10 rounded-full bg-primary'></div>
										) : (
											<div className='h-5 w-10 rounded-full bg-red-500'></div>
										)}
									</td>
									<td className='p-2 border-b border-gray-700'>
										<div className='flex gap-2'>
											<Pencil
												size={20}
												onClick={() => handleModal('edit', plan)}
												className='cursor-pointer text-secondary hover:text-secondary/80'
											/>
											<Trash
												size={20}
												onClick={() => handleModal('delete', plan)}
												className='cursor-pointer text-red-500 hover:text-red-700'
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
		</>
	)
}
