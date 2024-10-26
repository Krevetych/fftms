import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ITeacher, ITeacherCreate, ITeacherUpdate } from '@/types/teacher.types'

import { teacherService } from '@/services/teacher.service'

export function useCreateTeachers() {
	const [modal, setModal] = useState(false)
	const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const { register, handleSubmit, setValue, reset } = useForm<ITeacherCreate>({
		mode: 'onChange'
	})

	const queryClient = useQueryClient()

	const { mutate: createOrEditTeacher } = useMutation({
		mutationKey: ['teachers-create-edit'],
		mutationFn: (data: ITeacherCreate | ITeacherUpdate) => {
			if (selectedTeacher) {
				return teacherService.update(selectedTeacher.id, data as ITeacherUpdate)
			}
			return teacherService.create(data as ITeacherCreate)
		},
		onSuccess: () => {
			toast.success(`Запись ${actionType === 'edit' ? 'обновлена' : 'создана'}`)
			reset()
			setSelectedTeacher(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
			setModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message
			if (errorMessage === 'Teacher already exists') {
				toast.error('Преподаватель уже существует')
			}
		}
	})

	const onSubmit: SubmitHandler<ITeacherCreate> = data => {
		if (actionType === 'edit') {
			createOrEditTeacher(data)
		} else {
			createOrEditTeacher(data)
		}
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		teacher?: ITeacher
	) => {
		if (type === 'edit' && teacher) {
			setSelectedTeacher(teacher)
			setValue('fio', teacher.fio)
		} else if (type === 'delete' && teacher) {
			setSelectedTeacher(teacher)
		} else {
			setSelectedTeacher(null)
		}
		setActionType(type)
		setModal(!modal)
	}

	return {
		handleModal,
		register,
		modal,
		handleSubmit,
		onSubmit,
		actionType,
		setModal,
		selectedTeacher
	}
}
