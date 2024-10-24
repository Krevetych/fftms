import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { ERate } from '@/types/plan.types'
import {
	IFilteredSubject,
	IFilteredSubjectTerm,
	IForm,
	ISubject,
	ISubjectTerm,
	ITermForm
} from '@/types/subject.types'

export function useFilteredSubjects({ rate }: { rate: ERate }) {
	const [filters, setFilters] = useState<
		IFilteredSubject | IFilteredSubjectTerm | undefined
	>()

	const { register, handleSubmit, reset } = useForm<ITermForm | IForm>({
		mode: 'onChange'
	})

	const onSubmit: SubmitHandler<IForm | ITermForm> = data => {
		if (rate === ERate.HOURLY) {
			const formData = data as IForm
			setFilters({
				month: formData.month || '',
				monthHalf: formData.monthHalf || '',
				teacherId: formData.teacherId || '',
				type: formData.type || '',
				groupId: formData.groupId || ''
			})
		} else {
			const formData = data as ITermForm
			setFilters({
				term: formData.term || '',
				teacherId: formData.teacherId || '',
				type: formData.type || '',
				groupId: formData.groupId || ''
			})
		}
	}

	const resetFilters = () => {
		reset()
		setFilters(undefined)
	}

	return {
		filters,
		handleSubmit,
		onSubmit,
		register,
		resetFilters
	}
}
