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

import { ERate, IFilteredPlan, IFilters, IPlan } from '@/types/plan.types'
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
	const [filters, setFilters] = useState<IFilters | undefined>()
	const [editingSubject, setEditingSubject] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data: plansData } = useQuery({
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
			} else if (errorMessage === 'Invalid hours') {
				toast.error('Часы не могут быть отрицательными')
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
			} else if (errorMessage === 'Invalid hours') {
				toast.error('Часы не могут быть отрицательными')
			} else {
				toast.error('Неизвестная ошибка')
			}
		}
	})

	const onSubmit: SubmitHandler<ISubjectForm> = data => {
		setFilters({
			year: data.year || '',
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
		monthHalf: EMonthHalf,
		hours: string
	) => {
		const subjectData = getValues(`subjects.${subjectId}.hours`)
		const plan = await planService.getByid(planId)
		const rate = watch('rate')

		if (plan && rate === ERate.HOURLY) {
			await mutation.mutateAsync({
				subjectId: subjectId !== 'new' ? subjectId : undefined,
				month,
				monthHalf,
				hours: Number(hours),
				planId
			})
		} else {
			await mutationTerm.mutateAsync({
				subjectId: subjectId !== 'new' ? subjectId : undefined,
				term,
				hours: Number(hours),
				planId
			})
		}
	}

	const handleHoursClick = (subjectId: string) => {
		setEditingSubject(subjectId)
	}

	const handleBlur = async (subjectId: string, planId: string, hours: string) => {
		await handleCreateSubject(
			subjectId,
			planId,
			getValues('term') as ETerm,
			getValues('month') as EMonth,
			getValues('monthHalf') as EMonthHalf,
			hours
		)
		setEditingSubject(null)
	}

	const resetFilters = () => {
		reset()
		setFilters(undefined)
	}

	const filteredPlans = fPlansData?.filter((plan: IPlan) =>
		plan.teacher.fio.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex bg-card justify-between gap-x-10 items-center w-fit mx-5 mt-5'
			>
				<SelectInput
					label='Год'
					options={uniqueYears.map(year => ({
						value: year,
						label: year
					}))}
					{...register('year', { required: true })}
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
			</form>

			<div className='my-3 h-0.5 bg-primary w-full' />

			<div className='flex justify-between overflow-y-hidden'>
				<div className='w-full'>
					<div className='flex items-center justify-start'>
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
					{isLoadingFPlans ? (
						<Loader />
					) : filteredPlans?.length ? (
						<div className='overflow-x-auto'>
							<div className='overflow-y-auto max-h-[70vh]'>
								<PlanTable
									plans={filteredPlans as IFilteredPlan[]}
									editingSubject={editingSubject}
									handleHoursClick={handleHoursClick}
									handleBlur={handleBlur}
									register={register}
									rate={watch('rate')}
									getValues={getValues}
									handleCreateSubject={handleCreateSubject}
								/>
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
