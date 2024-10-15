'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Pencil, Plus, Trash, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'

import { GROUP, TYPE } from '@/constants/table.constants'

import { EType, IGroupCreate, IGroupUpdate } from '@/types/group.types'

import { groupService } from '@/services/group.service'

export function Groups() {
	const { register, handleSubmit, reset, setValue } = useForm<IGroupCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const queryClient = useQueryClient()

	const { mutate: createOrEditGroup } = useMutation({
		mutationKey: ['groups-create-edit'],
		mutationFn: (data: IGroupCreate | IGroupUpdate) => {
			if (selectedGroup) {
				return groupService.update(selectedGroup.id, data as IGroupUpdate)
			}
			return groupService.create(data as IGroupCreate)
		},
		onSuccess: () => {
			toast.success(`Запись ${actionType === 'edit' ? 'обновлена' : 'создана'}`)
			reset()
			setSelectedGroup(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['groups'] })
			setModal(false)
		}
	})

	const { mutate: deleteGroup } = useMutation({
		mutationKey: ['groups-delete'],
		mutationFn: (id: string) => groupService.delete(id),
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['groups'] })
		}
	})

	const onSubmit: SubmitHandler<IGroupCreate> = data => {
		if (actionType === 'edit') {
			createOrEditGroup(data)
		} else {
			createOrEditGroup(data)
		}
	}

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		group?: any
	) => {
		if (type === 'edit' && group) {
			setSelectedGroup(group)
			setValue('name', group.name)
			setValue('type', group.type)
		} else if (type === 'delete' && group) {
			setSelectedGroup(group)
		} else {
			reset()
			setSelectedGroup(null)
		}
		setActionType(type)
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
				onClick={() => handleModal('create')}
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
								<h1 className='text-2xl font-black'>
									{actionType === 'edit'
										? 'Редактирование группы'
										: actionType === 'delete'
											? 'Удаление группы'
											: 'Создание группы'}
								</h1>
								<X
									size={24}
									onClick={() => setModal(false)}
									className='rounded-full transition-colors cursor-pointer hover:bg-primary'
								/>
							</div>

							{actionType !== 'delete' ? (
								<>
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
														{TYPE[value]}
													</option>
												))}
											</select>
										</div>
									</div>
									<button
										type='submit'
										className='w-fit p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
									>
										{actionType === 'edit' ? 'Сохранить изменения' : 'Создать'}
									</button>
								</>
							) : (
								<div className='flex flex-col gap-2'>
									<p>
										Вы уверены, что хотите удалить группу{' '}
										<strong>{selectedGroup?.name}</strong>?
									</p>
									<button
										type='button'
										className='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
										onClick={() => {
											if (selectedGroup) {
												deleteGroup(selectedGroup.id)
												setModal(false)
											}
										}}
									>
										Удалить
									</button>
								</div>
							)}
						</form>
					</div>
				</div>
			)}

			{isLoading ? (
				<Loader />
			) : data?.length !== 0 && data ? (
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
							<th className='text-left p-2 border-b border-gray-700'>
								Действия
							</th>
						</tr>
					</thead>
					<tbody>
						{data.map(group => (
							<tr key={group.id}>
								<td className='p-2 border-b border-gray-700'>{group.name}</td>
								<td className='p-2 border-b border-gray-700'>
									{TYPE[group.type as EType]}
								</td>
								<td className='p-2 border-b border-gray-700'>
									<div className='flex gap-x-2'>
										<Pencil
											size={20}
											className='cursor-pointer text-secondary hover:text-secondary/80'
											onClick={() => handleModal('edit', group)}
										/>
										<Trash
											size={20}
											className='cursor-pointer text-red-500 hover:text-red-700'
											onClick={() => handleModal('delete', group)}
										/>
									</div>
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
