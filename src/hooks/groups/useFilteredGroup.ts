import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { IFilteredGroup, ISubjectForm } from '@/types/group.types'

export function useFilteredGroup() {
	const [filters, setFilters] = useState<IFilteredGroup | undefined>()

	const {
		register: filterRegister,
		handleSubmit: filterHandleSubmit,
		reset: filterReset
	} = useForm<ISubjectForm>({
		mode: 'onChange'
	})

	const resetFilters = () => {
		filterReset()
		setFilters(undefined)
	}

	const onSubmitFiltered: SubmitHandler<ISubjectForm> = data => {
		setFilters({
			type: data.type || '',
			course: data.course || '',
		})
	}

	return {
		filters,
		filterRegister,
		filterHandleSubmit,
		filterReset,
		onSubmitFiltered,
		resetFilters
	}
}
