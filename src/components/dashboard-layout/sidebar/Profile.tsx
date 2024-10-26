import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Input from '@/components/Input'

import { IUserPassword } from '@/types/auth.types'

import { Button } from '../Button'

import { userService } from '@/services/user.service'

export function Profile({ login }: { login: string | undefined }) {
	const {
		register,
		handleSubmit,
		watch,
		setError,
		reset,
		formState: { errors }
	} = useForm<IUserPassword>()

	const [modal, setModal] = useState(false)
	const [passwordVisible, setPasswordVisible] = useState({
		oldPassword: false,
		newPassword: false,
		confirmPassword: false
	})

	const { mutate } = useMutation({
		mutationKey: ['changePassword'],
		mutationFn: (data: IUserPassword) => userService.updatePassword(data),
		onSuccess: () => {
			toast.success('Пароль успешно изменен')
			reset()
			setModal(false)
		},
		onError: (error: AxiosError) => {
			const errorMessage = (error.response?.data as { message: string })
				?.message

			if (errorMessage === 'Invalid password') {
				toast.error('Неверный пароль')
			}
		}
	})

	const onSubmit: SubmitHandler<IUserPassword> = data => {
		mutate(data)
	}

	const togglePasswordVisible = (
		field: 'oldPassword' | 'newPassword' | 'confirmPassword'
	) => {
		setPasswordVisible(prev => ({
			...prev,
			[field]: !prev[field]
		}))
	}

	const newPassword = watch('newPassword')

	const handleConfirmPasswordChange = (value: string) => {
		if (value !== newPassword) {
			setError('confirmPassword', { message: 'Пароли не совпадают' })
		} else {
			setError('confirmPassword', { message: '' })
		}
	}

	return (
		<>
			<div
				className='flex items-center gap-x-4 cursor-pointer'
				onClick={() => setModal(!modal)}
			>
				<div className='w-10 h-10 rounded-full font-semibold flex items-center justify-center border border-primary'>
					{login?.charAt(0).toUpperCase()}
				</div>
				<p className='text-xl font-semibold capitalize'>{login}</p>
			</div>

			{modal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-bg p-4 rounded-lg shadow-lg'>
						<div className='flex items-center justify-between gap-x-10'>
							<h1 className='text-2xl font-black'>Сменить пароль</h1>
							<X
								size={24}
								onClick={() => setModal(false)}
								className='rounded-full transition-colors cursor-pointer hover:bg-primary'
							/>
						</div>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='flex flex-col gap-4 mt-4'
						>
							<Input
								type={passwordVisible.oldPassword ? 'text' : 'password'}
								togglePassword={() => togglePasswordVisible('oldPassword')}
								passwordVisible={passwordVisible.oldPassword}
								extra='relative inline-block'
								placeholder='Старый пароль'
								{...register('oldPassword', {
									required: 'Поле обязательно для заполнения'
								})}
							/>
							<Input
								type={passwordVisible.newPassword ? 'text' : 'password'}
								togglePassword={() => togglePasswordVisible('newPassword')}
								passwordVisible={passwordVisible.newPassword}
								extra='relative inline-block'
								placeholder='Новый пароль'
								{...register('newPassword', {
									required: 'Поле обязательно для заполнения'
								})}
							/>
							<Input
								type={passwordVisible.confirmPassword ? 'text' : 'password'}
								togglePassword={() => togglePasswordVisible('confirmPassword')}
								passwordVisible={passwordVisible.confirmPassword}
								extra='relative inline-block'
								placeholder='Повторите новый пароль'
								{...register('confirmPassword', {
									required: 'Поле обязательно для заполнения',
									onChange: e => handleConfirmPasswordChange(e.target.value)
								})}
							/>
							{errors.confirmPassword && (
								<span className='text-red-500'>
									{errors.confirmPassword.message}
								</span>
							)}

							<Button
								type='submit'
								extra='w-full p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
							>
								Сохранить
							</Button>
						</form>
					</div>
				</div>
			)}
		</>
	)
}
