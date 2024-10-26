'use client'

import { useState } from 'react'

import Input from '@/components/Input'
import Loader from '@/components/Loader'
import { Button } from '@/components/dashboard-layout/Button'

import { useLogin } from '@/hooks/useLogin'

export function Login() {
	const [passwordVisible, setPasswordVisible] = useState(false)

	const { handleSubmit, onSubmit, register, isPending } = useLogin()

	const togglePasswordVisible = () => {
		setPasswordVisible(!passwordVisible)
	}

	return (
		<div className='flex h-screen items-center justify-center'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-1/4 flex flex-col border border-solid border-gray-700 py-16 px-10 rounded-xl'
			>
				<h1 className='text-2xl text-center font-black mb-10'>Вход</h1>
				<div className='flex flex-col gap-y-4'>
					<Input
						type='text'
						placeholder='Логин'
						{...register('login', {
							required: 'Login is required'
						})}
					/>

					<Input
						type={passwordVisible ? 'text' : 'password'}
						togglePassword={togglePasswordVisible}
						extra='relative inline-block'
						passwordVisible={passwordVisible}
						placeholder='Пароль'
						{...register('password', {
							required: 'Password is required'
						})}
					/>
				</div>

				<Button
					type='submit'
					extra='text-text p-4 mt-5 bg-primary rounded-lg text-xl font-semibold transition-colors hover:bg-primary/80'
				>
					{isPending ? <Loader /> : <p>Войти</p>}
				</Button>
			</form>
		</div>
	)
}
