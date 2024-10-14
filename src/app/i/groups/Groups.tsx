'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'

import { GROUP, TYPE } from '@/constants/table.constants'

import { EType, IGroupCreate } from '@/types/group.types'

import { groupService } from '@/services/group.service'

export function Groups() {
	const { register, handleSubmit, reset } = useForm<IGroupCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['groups-create'],
		mutationFn: (data: IGroupCreate) => {
			console.log(data)
			return groupService.create(data)
		},
		onSuccess: () => {
			toast.success('Группа создана')
			reset()
			queryClient.invalidateQueries({ queryKey: ['groups'] })
		}
	})

	const onSubmit: SubmitHandler<IGroupCreate> = data => {
		mutate(data)
		setModal(false)
	}

	const handleModal = () => {
		setModal(!modal)
	}

	const { data, isLoading } = useQuery({
		queryKey: ['groups'],
		queryFn: () => {
			return groupService.getAll()
		}
	})

	return (
		<>
			<div
				className='flex items-center gap-2 p-3 bg-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary/80'
				onClick={() => handleModal()}
			>
				<Plus />
				<p>Создать</p>
			</div>
			{modal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-bg p-4 rounded-lg shadow-lg'>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='flex flex-col gap-4'
						>
							<div className='flex items-center justify-between'>
								<h1 className='text-2xl font-black'>Создание группы</h1>
								<X
									size={24}
									onClick={() => setModal(false)}
									className='rounded-full transition-colors cursor-pointer hover:bg-primary'
								/>
							</div>
							<div className='flex flex-col gap-2'>
								<input
									{...register('name', { required: true })}
									type='text'
									placeholder='Группа'
									className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
								/>
								<div className='flex gap-x-4'>
									<select
										{...register('type', { required: true })}
										className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
									>
										<option
											value=''
											disabled
											selected
										>
											Выберите тип
										</option>
										{Object.entries(EType).map(([type, value]) => (
											<option
												key={type}
												value={type}
											>
												{value}
											</option>
										))}
									</select>
								</div>
							</div>
							<button
								type='submit'
								className='w-fit p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
							>
								Создать
							</button>
						</form>
					</div>
				</div>
			)}
			{isLoading ? (
				<Loader />
			) : data?.length != 0 && data ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							{GROUP.map(group => (
								<th
									className='text-left p-2 border-b border-gray-700'
									key={group.id}
								>
									{group.title}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map(group => (
							<tr key={group.id}>
								<td className='p-2 border-b border-gray-700'>{group.name}</td>
								<td className='p-2 border-b border-gray-700'>
									{TYPE[group.type as EType]}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
