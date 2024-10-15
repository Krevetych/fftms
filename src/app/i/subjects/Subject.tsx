'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Pencil, Plus, Trash, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'

import { MONTH, MONTH_HALF, SUBJECT } from '@/constants/table.constants'

import { IPlan } from '@/types/plan.types'
import {
	EMonth,
	EMonthHalf,
	ISubjectCreate,
	ISubjectUpdate
} from '@/types/subject.types'

import { planService } from '@/services/plan.service'
import { subjectService } from '@/services/subject.service'

export function Subject() {
	const { register, handleSubmit, reset, setValue } = useForm<ISubjectCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [selectedSubject, setSelectedSubject] = useState<any | null>(null)
	const [actionType, setActionType] = useState<
		'create' | 'edit' | 'delete' | null
	>(null)

	const queryClient = useQueryClient()

	const { mutate: createOrEditSubject } = useMutation({
		mutationKey: ['subjects-create-edit'],
		mutationFn: (data: ISubjectCreate | ISubjectUpdate) => {
			if (selectedSubject) {
				return subjectService.update(selectedSubject.id, data as ISubjectUpdate)
			}
			return subjectService.create(data as ISubjectCreate)
		},
		onSuccess: () => {
			toast.success(
				`Вычитанные часы ${actionType === 'edit' ? 'обновлены' : 'созданы'}`
			)
			reset()
			setSelectedSubject(null)
			setActionType(null)
			queryClient.invalidateQueries({ queryKey: ['subjects'] })
			setModal(false)
		}
	})

	const { mutate: deleteSubject } = useMutation({
		mutationKey: ['subjects-delete'],
		mutationFn: (id: string) => subjectService.delete(id),
		onSuccess: () => {
			toast.success('Вычитанные часы удалены')
			queryClient.invalidateQueries({ queryKey: ['subjects'] })
		}
	})

	const { data: subjectsData, isLoading } = useQuery({
		queryKey: ['subjects'],
		queryFn: () => {
			return subjectService.getAll()
		}
	})

	const { data: plansData, isLoading: isLoadingPlans } = useQuery({
		queryKey: ['plans'],
		queryFn: () => {
			return planService.getAll()
		}
	})

	const handleModal = (
		type: 'create' | 'edit' | 'delete' | null,
		subject?: any
	) => {
		if (type === 'edit' && subject) {
			setSelectedSubject(subject)
			setValue('month', subject.month)
			setValue('monthHalf', subject.monthHalf)
			setValue('hours', subject.hours)
			setValue('planId', subject.planId)
		} else if (type === 'delete' && subject) {
			setSelectedSubject(subject)
		} else {
			reset()
			setSelectedSubject(null)
		}
		setActionType(type)
		setModal(!modal)
	}

	const onSubmit: SubmitHandler<ISubjectCreate> = data => {
		if (actionType === 'edit') {
			createOrEditSubject(data)
		} else {
			createOrEditSubject(data)
		}
	}

	return (
		<>
			{/* <div
				className='flex items-center gap-2 p-3 bg-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary/80'
				onClick={() => handleModal('create')}
			>
				<Plus />
				<p>Создать</p>
			</div> */}
			{modal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-bg p-4 rounded-lg shadow-lg'>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='flex flex-col gap-4'
						>
							<div className='flex items-center gap-x-4'>
								<h1 className='text-2xl font-black'>
									{actionType === 'edit'
										? 'Редактирование вычитанных часов'
										: actionType === 'delete'
											? 'Удаление вычитанных часов'
											: 'Создание вычитанных часов'}
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
										<select
											{...register('month', { required: true })}
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										>
											<option
												value=''
												disabled
												selected
											>
												Выберите месяц
											</option>
											{Object.entries(EMonth).map(([month, value]) => (
												<option
													key={month}
													value={month}
												>
													{MONTH[value]}
												</option>
											))}
										</select>
										<select
											{...register('monthHalf', { required: true })}
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										>
											<option
												value=''
												disabled
												selected
											>
												Выберите половину месяца
											</option>
											{Object.entries(EMonthHalf).map(([monthHalf, value]) => (
												<option
													key={monthHalf}
													value={monthHalf}
												>
													{MONTH_HALF[value]}
												</option>
											))}
										</select>
										<input
											{...register('hours', { required: true })}
											type='text'
											placeholder='Кол-во часов'
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										/>
										<select
											{...register('planId', { required: true })}
											className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
										>
											<option
												value=''
												disabled
												selected
											>
												Выберите учебный план
											</option>
											{isLoadingPlans ? (
												<Loader />
											) : (
												plansData?.map((object: IPlan) => (
													<option
														key={object.id}
														value={object.id}
													>
														{object.year} {object.rate}
													</option>
												))
											)}
										</select>
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
										Вы уверены, что хотите удалить вычитанные часы{' '}
										<strong>{selectedSubject?.hours}</strong>?
									</p>
									<button
										type='button'
										className='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
										onClick={() => {
											if (selectedSubject) {
												deleteSubject(selectedSubject.id)
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
			) : subjectsData?.length !== 0 && subjectsData ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							{SUBJECT.map(subject => (
								<th
									className='text-left p-2 border-b border-gray-700'
									key={subject.id}
								>
									{subject.title}
								</th>
							))}
							<th className='text-left p-2 border-b border-gray-700'>
								Действия
							</th>
						</tr>
					</thead>
					<tbody>
						{subjectsData.map(object => (
							<tr key={object.id}>
								<td className='p-2 border-b border-gray-700'>
									{MONTH[object.month as EMonth]}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{MONTH_HALF[object.monthHalf as EMonthHalf]}
								</td>
								<td className='p-2 border-b border-gray-700'>{object.hours}</td>
								<td className='p-2 border-b border-gray-700'>
									{object.plan.year} {object.plan.rate}
								</td>
								<td className='p-2 border-b border-gray-700'>
									<div className='flex gap-x-2'>
										<Pencil
											size={20}
											onClick={() => handleModal('edit', object)}
											className='cursor-pointer text-secondary hover:text-secondary/80'
										/>
										<Trash
											size={20}
											onClick={() => handleModal('delete', object)}
											className='cursor-pointer text-red-500 hover:text-red-700'
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
