import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

import { objectService } from '@/services/object.service'

export function useImportObject() {
	const queryClient = useQueryClient()

	const [importModal, setImportModal] = useState(false)

	const { mutate: importObjects, isPending } = useMutation({
		mutationKey: ['objects-import'],
		mutationFn: (data: FormData) => objectService.upload(data),
		onSuccess: () => {
			toast.success('Записи импортированы')
			queryClient.invalidateQueries({ queryKey: ['objects'] })
			setImportModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === "Can't create object") {
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
			importObjects(formData)
		}
	}

	return { handleImportModal, importModal, setImportModal, handleFileChange, isPending }
}
