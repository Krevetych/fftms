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
		<div className='flex h-screen items-center justify-center'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-1/4 flex flex-col border border-solid border-gray-700 py-16 px-10 rounded-xl'
			>
				<h1 className='text-2xl text-center font-black mb-10'>Вход</h1>
				<div className='flex flex-col gap-y-4'>
					<input
						type='text'
						className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						placeholder='Логин'
						{...register('login', {
							required: 'Login is required'
						})}
					/>

					<input
						type='password'
						className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						placeholder='Пароль'
						{...register('password', {
							required: 'Password is required'
						})}
					/>
				</div>

				<button
					type='submit'
					className='text-text p-4 mt-5 bg-card rounded-lg text-xl font-semibold transition-colors duration-300 hover:bg-card/50'
				>
					Войти
				</button>
			</form>
		</div>
	)
}
