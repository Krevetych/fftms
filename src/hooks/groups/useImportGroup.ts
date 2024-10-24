import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

import { groupService } from '@/services/group.service'

export function useImportGroup() {
	const [importModal, setImportModal] = useState(false)

	const queryClient = useQueryClient()

	const { mutate: importGroups, isPending } = useMutation({
		mutationKey: ['groups-import'],
		mutationFn: (data: FormData) => groupService.upload(data),
		onSuccess: () => {
			toast.success('Записи импортированы')
			queryClient.invalidateQueries({ queryKey: ['groups'] })
			setImportModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === "Can't create group") {
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
			importGroups(formData)
		}
	}

	return {
		handleImportModal,
		importModal,
		setImportModal,
		handleFileChange,
		isPending
	}
}
