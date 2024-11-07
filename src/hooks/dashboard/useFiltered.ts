import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

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

export function useFiltered() {
	const [filters, setFilters] = useState<IFilters | undefined>()
	const [editingSubject, setEditingSubject] = useState<string | null>(null)

	const queryClient = useQueryClient()

	const { register, handleSubmit, getValues, watch, reset } =
		useForm<ISubjectForm>({
			mode: 'onBlur'
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
				queryKey: ['f-plans']
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

	const handleBlur = async (
		subjectId: string,
		planId: string,
		hours: string
	) => {
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

	return {
		filters,
		handleSubmit,
		onSubmit,
		resetFilters,
		handleBlur,
		register,
		watch,
		editingSubject,
		handleHoursClick,
		getValues,
		handleCreateSubject
	}
}
