'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { IAuthForm } from '@/types/auth.types'

import { PAGES } from '@/config/url.config'

import { authService } from '@/services/auth.service'

export function Login() {
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['login'],
		mutationFn: (data: IAuthForm) => {
			return authService.login(data)
		},
		onSuccess: () => {
			toast.success('Вход выполнен успешно')
			reset()
			push(PAGES.HOME)
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-4 max-w-32 justify-center text-black'
			>
				<input
					type='text'
					placeholder='Логин'
					{...register('login', {
						required: 'Login is required'
					})}
				/>

				<input
					type='password'
					placeholder='Пароль'
					{...register('password', {
						required: 'Password is required'
					})}
				/>

				<button
					type='submit'
					className='text-text'
				>
					Войти
				</button>
			</form>
		</div>
	)
}
