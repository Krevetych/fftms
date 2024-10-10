'use client'

import { useMutation } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { PAGES } from '@/config/url.config'

import { authService } from '@/services/auth.service'

export function LogoutButton() {
	const router = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => router.push(PAGES.LOGIN)
	})

	return (
		<div>
			<button onClick={() => mutate()}>
				<LogOut
					size={20}
					className='transition-colors hover:text-primary'
				/>
			</button>
		</div>
	)
}
