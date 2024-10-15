'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'
import PlanTable from '@/components/PlanTable'
import SelectInput from '@/components/SelectInput'

import { MONTH, MONTH_HALF, TYPE } from '@/constants/table.constants'

import { IFilters, IPlan } from '@/types/plan.types'
import { EMonth, EMonthHalf, ISubjectCreate } from '@/types/subject.types'

import { planService } from '@/services/plan.service'
import { subjectService } from '@/services/subject.service'
import { teacherService } from '@/services/teacher.service'

export interface ISubjectForm {
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

	const queryClient = useQueryClient()
	const [filters, setFilters] = useState<IFilters>()
	const [editingSubject, setEditingSubject] = useState<string | null>(null)

	const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => teacherService.getAll(),
		staleTime: 1000 * 60 * 5
	})

	const { data: plansData, isLoading: isLoadingPlans } = useQuery({
		queryKey: ['plans'],
		queryFn: () => planService.getAll(),
		staleTime: 1000 * 60 * 5
	})

	const uniqueYears = Array.from(
		new Set(plansData?.map((plan: IPlan) => plan.year))
	)

	const { data: fPlansData, isLoading: isLoadingFPlans } = useQuery({
		queryKey: ['f-plans', filters],
		queryFn: () => (filters ? planService.getFiltered(filters) : []),
		enabled: !!filters
	})

	const mutation = useMutation({
		mutationFn: async (
			subjectData: ISubjectCreate & { subjectId?: string }
		) => {
			return subjectData.subjectId
				? subjectService.update(subjectData.subjectId, {
						month: subjectData.month,
						monthHalf: subjectData.monthHalf,
						hours: subjectData.hours,
						planId: subjectData.planId
					})
				: subjectService.create(subjectData)
		},
		onSuccess: () => {
			toast.success(`Запись ${editingSubject ? 'обновлена' : 'создана'}`)
			queryClient.invalidateQueries({
				queryKey: ['f-plans', filters]
			})
			queryClient.invalidateQueries({
				queryKey: ['subjects']
			})
			setEditingSubject(null)
		},
		onError: () => {
			toast.error('Ошибка при сохранении записи')
		}
	})

	const onSubmit: SubmitHandler<ISubjectForm> = data => {
		setFilters({
			year: data.year || '',
			teacher: data.teacher || '',
			month: data.month || '',
			monthHalf: data.monthHalf || ''
		})
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
			await mutation.mutateAsync({
				subjectId: subjectId !== 'new' ? subjectId : undefined,
				month,
				monthHalf,
				hours: Number(subjectData),
				planId
			})
		}
	}

	const handleHoursClick = (subjectId: string) => {
		setEditingSubject(subjectId)
	}

	const handleBlur = async (subjectId: string, planId: string) => {
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
				<div className='flex justify-around'>
					<div>
						<SelectInput
							label='Год'
							options={uniqueYears.map(year => ({ value: year, label: year }))}
							{...register('year', { required: true })}
						/>
						<SelectInput
							label='Преподаватель'
							options={
								teachersData?.map(teacher => ({
									value: teacher.fio,
									label: teacher.fio
								})) || []
							}
							loading={isLoadingTeachers}
							{...register('teacher', { required: true })}
						/>
					</div>
					<div>
						<SelectInput
							label='Месяц'
							options={Object.entries(MONTH).map(([key, value]) => ({
								value: key as EMonth,
								label: value
							}))}
							{...register('month', { required: true })}
						/>
						<SelectInput
							label='Половина месяца'
							options={Object.entries(MONTH_HALF).map(([key, value]) => ({
								value: key as EMonthHalf,
								label: value
							}))}
							{...register('monthHalf', { required: true })}
						/>
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
			) : fPlansData?.length ? (
				<PlanTable
					plans={fPlansData}
					editingSubject={editingSubject}
					handleHoursClick={handleHoursClick}
					handleBlur={handleBlur}
					register={register}
					getValues={getValues}
					handleCreateSubject={handleCreateSubject}
				/>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
