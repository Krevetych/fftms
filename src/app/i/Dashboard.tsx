'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'

import { MONTH, MONTH_HALF, TYPE } from '@/constants/table.constants'

import { EType } from '@/types/group.types'
import { IFilters, IPlan } from '@/types/plan.types'
import { EMonth, EMonthHalf, ISubjectCreate } from '@/types/subject.types'

import { planService } from '@/services/plan.service'
import { subjectService } from '@/services/subject.service'
import { teacherService } from '@/services/teacher.service'

interface ISubjectForm {
	year: string
	teacher: string
	month: EMonth
	monthHalf: EMonthHalf
	subjects: {
		[id: string]: {
			hours: number
		}
	}
}

export function Dashboard() {
	const { register, handleSubmit, reset, getValues, setValue } =
		useForm<ISubjectForm>({
			mode: 'onChange'
		})

	const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => teacherService.getAll()
	})

	const { data: plansData, isLoading: isLoadingPlans } = useQuery({
		queryKey: ['plans'],
		queryFn: () => planService.getAll()
	})

	const uniqueYears = Array.from(
		new Set(plansData?.map((plan: IPlan) => plan.year))
	)

	const [filters, setFilters] = useState<IFilters>()
	const [editingSubject, setEditingSubject] = useState<string | null>(null)
	const queryClient = useQueryClient()

	const { data: fPlansData, isLoading: isLoadingFPlans } = useQuery({
		queryKey: ['f-plans', filters],
		queryFn: () => {
			if (!filters) return Promise.resolve([])
			return planService.getFiltered(filters)
		},
		enabled: !!filters
	})

	const mutation = useMutation({
		mutationFn: async (
			subjectData: ISubjectCreate & { subjectId?: string }
		) => {
			if (subjectData.subjectId) {
				return subjectService.update(subjectData.subjectId, {
					month: subjectData.month,
					monthHalf: subjectData.monthHalf,
					hours: subjectData.hours,
					planId: subjectData.planId
				})
			} else {
				return subjectService.create(subjectData)
			}
		},
		onSuccess: () => {
			toast.success('Запись успешно сохранена')
			queryClient.invalidateQueries({ queryKey: ['subjects', 'f-plans'] })
			queryClient.invalidateQueries({ queryKey: ['f-plans', filters] })
			setEditingSubject(null)
		},
		onError: () => {
			toast.error('Ошибка при сохранении записи')
		}
	})

	const onSubmit: SubmitHandler<ISubjectForm> = data => {
		const appliedFilters: IFilters = {
			year: data.year || '',
			teacher: data.teacher || '',
			month: data.month || '',
			monthHalf: data.monthHalf || ''
		}

		setFilters(appliedFilters)
		setEditingSubject(null)
	}

	const handleCreateSubject = async (
		subjectId: string,
		planId: string,
		month: EMonth,
		monthHalf: EMonthHalf
	) => {
		const subjectData = getValues(`subjects.${subjectId}.hours`)
		const plan = await planService.getByid(planId)

		if (plan) {
			if (subjectId === 'new') {
				await mutation.mutateAsync({
					month: month,
					monthHalf: monthHalf,
					hours: Number(subjectData),
					planId: planId
				})
			} else {
				await mutation.mutateAsync({
					month: month,
					monthHalf: monthHalf,
					hours: Number(subjectData),
					planId: planId,
					subjectId: subjectId
				})
			}
		}
	}

	const handleHoursClick = (subjectId: string) => {
		setEditingSubject(subjectId)
	}

	const handleBlur = async (subjectId: string, planId: string) => {
		setEditingSubject(null)
		await handleCreateSubject(
			subjectId,
			planId,
			getValues('month') as EMonth,
			getValues('monthHalf') as EMonthHalf
		)
		setEditingSubject(null)
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-y-2'
			>
				<div className='flex justify-between'>
					<div>
						<select
							{...register('year', { required: true })}
							className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						>
							<option value=''>Выберите год</option>
							{uniqueYears.map(year => (
								<option
									key={year}
									value={year}
								>
									{year}
								</option>
							))}
						</select>

						<select
							id='teacher'
							{...register('teacher', { required: true })}
							className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						>
							<option value=''>Выберите преподавателя</option>
							{isLoadingTeachers ? (
								<option>Загрузка...</option>
							) : (
								teachersData?.map(teacher => (
									<option
										key={teacher.id}
										value={teacher.fio}
									>
										{teacher.fio}
									</option>
								))
							)}
						</select>
					</div>

					<div>
						<select
							id='month'
							{...register('month', { required: true })}
							className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						>
							<option value=''>Выберите месяц</option>
							{Object.entries(MONTH).map(([key, value]) => (
								<option
									key={key}
									value={key as EMonth}
								>
									{value}
								</option>
							))}
						</select>
						<select
							id='monthHalf'
							{...register('monthHalf', { required: true })}
							className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						>
							<option value=''>Выберите половину месяца</option>
							{Object.entries(MONTH_HALF).map(([key, value]) => (
								<option
									key={key}
									value={key as EMonthHalf}
								>
									{value}
								</option>
							))}
						</select>
					</div>
				</div>
				<button
					type='submit'
					className='w-fit p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
				>
					Применить
				</button>
			</form>
			{isLoadingFPlans ? (
				<Loader />
			) : fPlansData && fPlansData.length > 0 ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700'>
								Предмет
							</th>
							<th className='text-left p-2 border-b border-gray-700'>Группа</th>
							<th className='text-left p-2 border-b border-gray-700'>Тип</th>
							<th className='text-left p-2 border-b border-gray-700'>
								Остаток часов
							</th>
							<th className='text-left p-2 border-b border-gray-700'>
								Вычитанные часы
							</th>
						</tr>
					</thead>
					<tbody>
						{fPlansData.map(plan => (
							<tr key={plan.id}>
								<td className='p-2 border-b border-gray-700'>
									{plan.Object.name}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.group.name}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{TYPE[plan.group.type as EType]}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.maxHours}
								</td>

								{plan.Subject.length > 0 ? (
									plan.Subject.map(subject => (
										<td
											key={subject.id}
											className='p-2 border-b border-gray-700 '
										>
											<div className='flex items-center gap-x-3'>
												{editingSubject === subject.id ? (
													<>
														<input
															type='text'
															{...register(`subjects.${subject.id}.hours`, {
																required: true
															})}
															className='p-3 w-1/2 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal outline-none border-none'
															defaultValue={subject.hours}
															onBlur={() => handleBlur(subject.id, plan.id)}
														/>
														<Check
															onClick={async () =>
																await handleCreateSubject(
																	subject.id,
																	plan.id,
																	getValues('month') as EMonth,
																	getValues('monthHalf') as EMonthHalf
																)
															}
															className='cursor-pointer text-primary hover:text-primary/80'
														/>
													</>
												) : (
													<span onClick={() => handleHoursClick(subject.id)}>
														{subject.hours}
													</span>
												)}
											</div>
										</td>
									))
								) : (
									<td className='p-2 border-b border-gray-700 '>
										<div className='flex items-center gap-x-3'>
											<input
												type='text'
												{...register(`subjects.new.hours`, { required: true })}
												placeholder='Введите часы'
												className='p-3 w-1/2 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal outline-none border-none'
											/>
											<Check
												onClick={async () =>
													await handleCreateSubject(
														'new',
														plan.id,
														getValues('month') as EMonth,
														getValues('monthHalf') as EMonthHalf
													)
												}
												className='cursor-pointer text-primary hover:text-primary/80'
											/>
										</div>
									</td>
								)}
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
