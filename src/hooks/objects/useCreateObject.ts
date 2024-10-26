import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { IObjectCreate, IObjectUpdate } from '@/types/object.types'

import { objectService } from '@/services/object.service'

export function useCreateObject() {
	const [modal, setModal] = useState(false)
	const [selectedObject, setSelectedObject] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const { register, handleSubmit, setValue, reset } = useForm<IObjectCreate>({
		mode: 'onChange'
	})

	const queryClient = useQueryClient()

	const { mutate: createOrEditObject } = useMutation({
		mutationKey: ['objects-create-edit'],
		mutationFn: (data: IObjectCreate | IObjectUpdate) => {
			if (selectedObject) {
				return objectService.update(selectedObject.id, data as IObjectUpdate)
			}
			return objectService.create(data as IObjectCreate)
		},
		onSuccess: () => {
			toast.success(`Запись ${actionType === 'edit' ? 'обновлена' : 'создана'}`)
			reset()
			setSelectedObject(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['objects'] })
			setModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message
			if (errorMessage === 'Object already exists') {
				toast.error('Предмет уже существует')
			}
		}
	})

	const onSubmit: SubmitHandler<IObjectCreate> = data => {
		if (actionType === 'edit') {
			createOrEditObject(data)
		} else {
			createOrEditObject(data)
		}
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		object?: any
	) => {
		if (type === 'edit' && object) {
			setSelectedObject(object)
			setValue('name', object.name)
		} else if (type === 'delete' && object) {
			setSelectedObject(object)
		} else {
			setSelectedObject(null)
		}
		setActionType(type)
		setModal(!modal)
	}

	return {handleModal, modal, handleSubmit, onSubmit, actionType, setModal, register, selectedObject}
}
