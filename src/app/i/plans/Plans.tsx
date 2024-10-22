'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Pencil, Plus, Trash, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'
import SelectInput from '@/components/SelectInput'

import { PLAN_STATUS, RATE } from '@/constants/table.constants'

import { EStatus } from '@/types/group.types'
import {
	ERate,
	IPlan,
	IPlanCreate,
	IPlanUpdate,
	IPlans
} from '@/types/plan.types'

import { groupService } from '@/services/group.service'
import { objectService } from '@/services/object.service'
import { planService } from '@/services/plan.service'
import { teacherService } from '@/services/teacher.service'

interface ISubjectForm {
	year: string
	rate: ERate
	objectId: string
	status: EStatus
	teacherId: string
	groupId: string
}

export function Plans() {
	const {
		register: createRegister,
		handleSubmit: createHandleSubmit,
		reset: createReset,
		setValue: createSetValue
	} = useForm<IPlanCreate>({
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
	const [filters, setFilters] = useState<IPlans>()
	const [importModal, setImportModal] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const queryClient = useQueryClient()

	const { data: fPlansData } = useQuery({
		queryKey: ['filtered-plans', filters],
		queryFn: () => (filters ? planService.getPlaned(filters) : []),
		enabled: !!filters
	})

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
			createReset()
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
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Plan has related records') {
				toast.warning('Запись имеет связь с вычитанными часами')
			}
		}
	})

	const { mutate: importPlans, isPending } = useMutation({
		mutationKey: ['plans-import'],
		mutationFn: (data: FormData) => planService.upload(data),
		onSuccess: () => {
			toast.success('Записи импортированы')
			queryClient.invalidateQueries({ queryKey: ['plans'] })
			setImportModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			toast.error(`${errorMessage}. Проверьте файл`)
		}
	})

	const onSubmitCreate: SubmitHandler<IPlanCreate> = data => {
		createOrEditPlan(data)
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		plan?: any
	) => {
		if (type === 'edit' && plan) {
			setSelectedPlan(plan)
			createSetValue('year', plan.year)
			createSetValue('rate', plan.rate)
			createSetValue('maxHours', plan.maxHours)
			createSetValue('objectId', plan.objectId)
			createSetValue('teacherId', plan.teacherId)
			createSetValue('groupId', plan.groupId)
		} else if (type === 'delete' && plan) {
			setSelectedPlan(plan)
		} else {
			createReset()
			setSelectedPlan(null)
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
			importPlans(formData)
		}
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

	const { data: plansData } = useQuery({
		queryKey: ['plans'],
		queryFn: () => planService.getAll(),
		staleTime: 1000 * 60 * 5
	})

	const year = () => {
		const year = new Date().getFullYear()
		return `${year}-${year + 1}`
	}

	const onSubmit: SubmitHandler<ISubjectForm> = data => {
		setFilters({
			year: data.year || '',
			rate: data.rate || '',
			status: data.status || '',
			objectId: data.objectId || '',
			teacherId: data.teacherId || '',
			groupId: data.groupId || ''
		})
	}

	const resetFilters = () => {
		filterReset()
	}

	const uniqueYears = Array.from(
		new Set(plansData?.map((plan: IPlan) => plan.year))
	)

	const mapData =
		fPlansData && fPlansData?.length > 0 && filters
			? fPlansData
			: fPlansData?.length === 0 && filters
				? []
				: data

	const filteredPlans = mapData?.filter((plan: IPlan) =>
		plan.teacher.fio.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<form
				onSubmit={filterHandleSubmit(onSubmit)}
				className='flex bg-card justify-between gap-x-10 items-center w-fit mx-5 mt-5'
			>
				<SelectInput
					label='Год'
					options={uniqueYears.map(year => ({
						value: year,
						label: year
					}))}
					{...filterRegister('year')}
				/>
				<SelectInput
					label='Преподаватель'
					options={
						teachersData?.map(teacher => ({
							value: teacher.id,
							label: teacher.fio
						})) || []
					}
					loading={isLoadingTeachers}
					{...filterRegister('teacherId')}
				/>
				<SelectInput
					label='Тариф'
					options={Object.entries(RATE).map(([rate, value]) => ({
						value: rate as ERate,
						label: value
					}))}
					{...filterRegister('rate')}
				/>
				<SelectInput
					label='Статус'
					options={Object.entries(PLAN_STATUS).map(([status, value]) => ({
						value: status as EStatus,
						label: value
					}))}
					{...filterRegister('status')}
				/>

				<SelectInput
					label='Группа'
					options={
						groupData?.map(group => ({
							value: group.id,
							label: group.name
						})) || []
					}
					loading={isLoadingGroups}
					{...filterRegister('groupId')}
				/>
				<SelectInput
					label='Предмет'
					options={
						objectsData?.map(obj => ({
							value: obj.id,
							label: obj.name
						})) || []
					}
					loading={isLoadingObjects}
					{...filterRegister('objectId')}
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
								placeholder='Поиск по ФИО'
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
									onSubmit={createHandleSubmit(onSubmitCreate)}
									className='flex flex-col gap-4'
								>
									<div className='flex items-center justify-between'>
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
													{...createRegister('year', { required: true })}
													type='text'
													placeholder='Учебный год'
													defaultValue={year()}
													className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
												/>
												<select
													{...createRegister('rate', { required: true })}
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
													{...createRegister('maxHours', { required: true })}
													type='text'
													placeholder='Макс. кол-во часов'
													className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
												/>
												<select
													{...createRegister('objectId', { required: true })}
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
													{...createRegister('teacherId', { required: true })}
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
													{...createRegister('groupId', { required: true })}
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
					) : filteredPlans?.length !== 0 && filteredPlans ? (
						<div className='overflow-x-auto'>
							<div className='overflow-y-auto max-h-[70vh]'>
								<table className='w-full mt-4 border-collapse '>
									<thead className='whitespace-nowrap'>
										<tr>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Учебный год
											</th>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Тариф
											</th>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Макс. кол-во часов
											</th>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Отработанные часы
											</th>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Предмет
											</th>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Преподаватель
											</th>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Группа
											</th>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Статус
											</th>
											<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
												Действия
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredPlans.map(plan => (
											<tr key={plan.id}>
												<td className='p-2 border-b border-gray-700'>
													{plan.year}
												</td>
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
						</div>
					) : (
						<NotFoundData />
					)}
				</div>
			</div>
		</>
	)
}
