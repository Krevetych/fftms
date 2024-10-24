'use client'

import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { IAuthForm } from '@/types/auth.types'

import { PAGES } from '@/config/url.config'

import { authService } from '@/services/auth.service'

export function useLogin() {
	const { register, handleSubmit } = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const { push } = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ['login'],
		mutationFn: (data: IAuthForm) => authService.login(data),
		onSuccess: () => {
			toast.success('Вход выполнен успешно')
			push(PAGES.HOME)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Invalid password') {
				toast.error('Неверный логин или пароль')
			} else if (errorMessage === 'User not found') {
				toast.error('Пользователь не найден')
			} else {
				toast.error('Неизвестная ошибка')
			}
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	return { handleSubmit, onSubmit, register, isPending }
}
