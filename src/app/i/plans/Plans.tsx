'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'

import { PLAN, RATE } from '@/constants/table.constants'

import { IGroup } from '@/types/group.types'
import { IObject } from '@/types/object.types'
import { ERate, IPlanCreate } from '@/types/plan.types'
import { ITeacher } from '@/types/teacher.types'

import { groupService } from '@/services/group.service'
import { objectService } from '@/services/object.service'
import { planService } from '@/services/plan.service'
import { teacherService } from '@/services/teacher.service'

export function Plans() {
	const { register, handleSubmit, reset } = useForm<IPlanCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['plans-create'],
		mutationFn: (data: IPlanCreate) => {
			console.log(data)
			return planService.create(data)
		},
		onSuccess: () => {
			toast.success('План создан')
			reset()
			queryClient.invalidateQueries({ queryKey: ['plans'] })
		}
	})

	const { data: plansData, isLoading } = useQuery({
		queryKey: ['plans'],
		queryFn: () => {
			return planService.getAll()
		}
	})

	const { data: objectsData, isLoading: isLoadingObjects } = useQuery({
		queryKey: ['objects'],
		queryFn: () => {
			return objectService.getAll()
		}
	})

	const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => {
			return teacherService.getAll()
		}
	})

	const { data: groupData, isLoading: isLoadingGroups } = useQuery({
		queryKey: ['groups'],
		queryFn: () => {
			return groupService.getAll()
		}
	})

	const handleModal = () => {
		setModal(!modal)
	}

	const onSubmit: SubmitHandler<IPlanCreate> = data => {
		mutate(data)
		setModal(false)
	}

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
							<div className='flex items-center gap-x-4'>
								<h1 className='text-2xl font-black'>Создание учебного плана</h1>
								<X
									size={24}
									onClick={() => setModal(false)}
									className='rounded-full transition-colors cursor-pointer hover:bg-primary'
								/>
							</div>
							<div className='flex flex-col gap-2'>
								<input
									{...register('year', { required: true })}
									type='text'
									placeholder='Учебный год'
									className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
								/>
								<select
									{...register('rate', { required: true })}
									className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
								>
									<option
										value=''
										disabled
										selected
									>
										Выберите тариф
									</option>
									{Object.entries(ERate).map(([rate, value]) => (
										<option
											key={rate}
											value={rate}
										>
											{value}
										</option>
									))}
								</select>
								<input
									{...register('maxHours', { required: true })}
									type='text'
									placeholder='Макс. кол-во часов'
									className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
								/>
								<select
									{...register('objectId', { required: true })}
									className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
								>
									<option
										value=''
										disabled
										selected
									>
										Выберите предмет
									</option>
									{isLoadingObjects ? (
										<Loader />
									) : (
										objectsData?.map((object: IObject) => (
											<option
												key={object.id}
												value={object.id}
											>
												{object.name}
											</option>
										))
									)}
								</select>
								<select
									{...register('teacherId', { required: true })}
									className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
								>
									<option
										value=''
										disabled
										selected
									>
										Выберите преподавателя
									</option>
									{isLoadingTeachers ? (
										<Loader />
									) : (
										teachersData?.map((object: ITeacher) => (
											<option
												key={object.id}
												value={object.id}
											>
												{object.fio}
											</option>
										))
									)}
								</select>
								<select
									{...register('groupId', { required: true })}
									className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
								>
									<option
										value=''
										disabled
										selected
									>
										Выберите группу
									</option>
									{isLoadingGroups ? (
										<Loader />
									) : (
										groupData?.map((object: IGroup) => (
											<option
												key={object.id}
												value={object.id}
											>
												{object.name}
											</option>
										))
									)}
								</select>
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
			) : plansData?.length != 0 && plansData ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							{PLAN.map(plan => (
								<th
									className='text-left p-2 border-b border-gray-700'
									key={plan.id}
								>
									{plan.title}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{plansData.map(plan => (
							<tr key={plan.id}>
								<td className='p-2 border-b border-gray-700'>{plan.year}</td>
								<td className='p-2 border-b border-gray-700'>
									{RATE[plan.rate as ERate]}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.maxHours}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.Object.name}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.teacher.fio}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.group.name}
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
