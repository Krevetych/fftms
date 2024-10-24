import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

import { ITeacher } from '@/types/teacher.types'

import { teacherService } from '@/services/teacher.service'

export function useImportTeachers() {
	const [importModal, setImportModal] = useState(false)

	const queryClient = useQueryClient()

	const { mutate: importTeachers, isPending } = useMutation({
		mutationKey: ['teachers-import'],
		mutationFn: (data: FormData) => teacherService.upload(data),
		onSuccess: () => {
			toast.success('Записи импортированы')
			queryClient.invalidateQueries({ queryKey: ['teachers'] })
			setImportModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === "Can't create teacher") {
				toast.error(
					'Возникла ошибка при импорте данных из файла, сравните структуру файла с примером и повторите попытку'
				)
			}

			toast.warning(errorMessage)
		}
	})

	const handleImportModal = () => {
		setImportModal(!importModal)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const formData = new FormData()
			formData.append('file', file)
			importTeachers(formData)
		}
	}

	return {
		handleFileChange,
		handleImportModal,
		importModal,
		setImportModal,
		isPending
	}
}
