import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { IPlanCreate, IPlanUpdate } from '@/types/plan.types'

import { planService } from '@/services/plan.service'

export function useCreatePlans() {
	const [modal, setModal] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const {
		register: createRegister,
		handleSubmit: createHandleSubmit,
		reset: createReset,
		setValue: createSetValue
	} = useForm<IPlanCreate>({
		mode: 'onChange'
	})

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
			createReset()
			setSelectedPlan(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['plans'] })
			setModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Plan already exists') {
				toast.error('План уже существует')
			}
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

	return {
		handleModal,
		modal,
		setModal,
		createHandleSubmit,
		onSubmitCreate,
		actionType,
		createRegister,
		selectedPlan,

	}
}
