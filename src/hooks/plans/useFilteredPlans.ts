import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { IPlans, ISubjectForm } from '@/types/plan.types'

import { planService } from '@/services/plan.service'

export function useFilteredPlans() {
	const [filters, setFilters] = useState<IPlans | undefined>()

	const {
		register: filterRegister,
		handleSubmit: filterHandleSubmit,
		reset: filterReset
	} = useForm<ISubjectForm>({
		mode: 'onChange'
	})

	const { data: fPlansData } = useQuery({
		queryKey: ['filtered-plans', filters],
		queryFn: () => (filters ? planService.getPlaned(filters) : []),
		enabled: !!filters
	})

	const onSubmit: SubmitHandler<ISubjectForm> = data => {
		setFilters({
			year: data.year || '',
			rate: data.rate || '',
			objectId: data.objectId || '',
			teacherId: data.teacherId || '',
			groupId: data.groupId || ''
		})
	}

	const resetFilters = () => {
		filterReset()
		setFilters(undefined)
	}

	return {
		fPlansData,
		filters,
		filterHandleSubmit,
		onSubmit,
		filterRegister,
		resetFilters,
	}
}
