import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

import { planService } from '@/services/plan.service'

export function useImportPlans() {
	const [importModal, setImportModal] = useState(false)

	const queryClient = useQueryClient()

	const { mutate: importPlans, isPending } = useMutation({
		mutationKey: ['plans-import'],
		mutationFn: (data: FormData) => planService.upload(data),
		onSuccess: () => {
			toast.success('Записи импортированы')
			queryClient.invalidateQueries({ queryKey: ['plans'] })
			setImportModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			toast.error(`${errorMessage}. Проверьте файл`)
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
			importPlans(formData)
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
