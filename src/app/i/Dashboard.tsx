'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'
import PlanTable from '@/components/PlanTable'
import SelectInput from '@/components/SelectInput'

import { MONTH, MONTH_HALF, RATE, TERM } from '@/constants/table.constants'

import { ERate, IFilters, IPlan } from '@/types/plan.types'
import {
	EMonth,
	EMonthHalf,
	ETerm,
	ISubjectCreate,
	ISubjectTermCreate
} from '@/types/subject.types'


import { planService } from '@/services/plan.service'
import { subjectService } from '@/services/subject.service'
import { teacherService } from '@/services/teacher.service'

export interface ISubjectForm {
	year: string
	teacher: string
	rate: ERate
	term: ETerm
	month: EMonth
	monthHalf: EMonthHalf
	subjects: {
		[id: string]: {
			hours: number
		}
	}
}

export function Dashboard() {
	const { register, handleSubmit, getValues, watch, reset } =
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
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Max hours exceeded') {
				toast.error('Превышено максимальное количество часов')
			} else {
				toast.error('Неизвестная ошибка')
			}
		}
	})

	const mutationTerm = useMutation({
		mutationFn: async (
			subjectData: ISubjectTermCreate & { subjectId?: string }
		) => {
			return subjectData.subjectId
				? subjectService.updateTerm(subjectData.subjectId, {
						term: subjectData.term,
						hours: subjectData.hours,
						planId: subjectData.planId
					})
				: subjectService.createTerm(subjectData)
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
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Max hours exceeded') {
				toast.error('Превышено максимальное количество часов')
			} else {
				toast.error('Неизвестная ошибка')
			}
		}
	})

	const onSubmit: SubmitHandler<ISubjectForm> = data => {
		setFilters({
			year: data.year || '',
			teacher: data.teacher || '',
			month: data.month || '',
			monthHalf: data.monthHalf || '',
			rate: data.rate || '',
			term: data.term || ''
		})
		setEditingSubject(null)
	}

	const handleCreateSubject = async (
		subjectId: string,
		planId: string,
		term: ETerm,
		month: EMonth,
		monthHalf: EMonthHalf
	) => {
		const subjectData = getValues(`subjects.${subjectId}.hours`)
		const plan = await planService.getByid(planId)
		const rate = watch('rate')

		if (plan && rate === ERate.HOURLY) {
			await mutation.mutateAsync({
				subjectId: subjectId !== 'new' ? subjectId : undefined,
				month,
				monthHalf,
				hours: Number(subjectData),
				planId
			})
		} else {
			await mutationTerm.mutateAsync({
				subjectId: subjectId !== 'new' ? subjectId : undefined,
				term,
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
			getValues('term') as ETerm,
			getValues('month') as EMonth,
			getValues('monthHalf') as EMonthHalf
		)
		setEditingSubject(null)
	}

	const resetFilters = () => {
		reset()
	}

	return (
		<div className='flex justify-between'>
			<div className='w-2/3'>
				{isLoadingFPlans ? (
					<Loader />
				) : fPlansData?.length ? (
					<PlanTable
						plans={fPlansData}
						editingSubject={editingSubject}
						handleHoursClick={handleHoursClick}
						handleBlur={handleBlur}
						register={register}
						rate={watch('rate')}
						getValues={getValues}
						handleCreateSubject={handleCreateSubject}
					/>
				) : (
					<NotFoundData />
				)}
			</div>
			<div className='w-1/3 flex items-center justify-center'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex bg-card border border-primary rounded-2xl border-solid p-10 flex-col justify-center items-center w-fit'
				>
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
						<SelectInput
							label='Тариф'
							options={Object.entries(RATE).map(([rate, value]) => ({
								value: rate as ERate,
								label: value
							}))}
							{...register('rate', { required: true })}
						/>
						{watch('rate') === ERate.SALARIED ? (
							<SelectInput
								label='Семестр'
								options={Object.entries(TERM).map(([term, value]) => ({
									value: term as ETerm,
									label: value
								}))}
								{...register('term', { required: true })}
							/>
						) : watch('rate') === ERate.HOURLY ? (
							<>
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
							</>
						) : null}
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
