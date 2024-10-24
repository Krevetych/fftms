import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Dispatch, SetStateAction, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	IFilteredGroup,
	IGroupCreate,
	IGroupUpdate,
	ISubjectForm
} from '@/types/group.types'

import { groupService } from '@/services/group.service'

export function useCreateGroup() {
	const { register, handleSubmit, reset, setValue } = useForm<IGroupCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const queryClient = useQueryClient()

	const { mutate: createOrEditGroup } = useMutation({
		mutationKey: ['groups-create-edit'],
		mutationFn: (data: IGroupCreate | IGroupUpdate) => {
			if (selectedGroup) {
				return groupService.update(selectedGroup.id, data as IGroupUpdate)
			}
			return groupService.create(data as IGroupCreate)
		},
		onSuccess: () => {
			toast.success(`Запись ${actionType === 'edit' ? 'обновлена' : 'создана'}`)
			setSelectedGroup(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['groups'] })
			setModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Group already exists') {
				toast.error('Группа уже существует')
			}
		}
	})

	const onSubmit: SubmitHandler<IGroupCreate> = data => {
		if (actionType === 'edit') {
			createOrEditGroup(data)
		} else {
			createOrEditGroup(data)
		}
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		group?: any
	) => {
		if (type === 'edit' && group) {
			setSelectedGroup(group)
			setValue('name', group.name)
			setValue('type', group.type)
			setValue('course', group.course)
		} else if (type === 'delete' && group) {
			setSelectedGroup(group)
		} else {
			reset()
			setSelectedGroup(null)
		}
		setActionType(type)
		setModal(!modal)
	}

	return {
		handleModal,
		register,
		handleSubmit,
		onSubmit,
		actionType,
		reset,
		setValue,
		setModal,
		modal,
		selectedGroup
	}
}
