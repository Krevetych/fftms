'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'

import { EKind } from '@/types/group.types'
import { IObject } from '@/types/object.types'
import { IPlan } from '@/types/plan.types'
import { EMonth, EMonthHalf, ISubjectCreate } from '@/types/subject.types'

import { planService } from '@/services/plan.service'
import { subjectService } from '@/services/subject.service'

export function Subject() {
	const { register, handleSubmit, reset } = useForm<ISubjectCreate>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ['subjects-create'],
		mutationFn: (data: ISubjectCreate) => {
			return subjectService.create(data)
		},
		onSuccess: () => {
			toast.success('Вычитанные часы созданы')
			reset()
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

	const handleModal = () => {
		setModal(!modal)
	}

	const onSubmit: SubmitHandler<ISubjectCreate> = data => {
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
								<h1 className='text-2xl font-black'>
									Создание вычитанных часов
								</h1>
								<X
									size={24}
									onClick={() => setModal(false)}
									className='rounded-full transition-colors cursor-pointer hover:bg-primary'
								/>
							</div>
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
											{value}
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
											{value}
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
								Создать
							</button>
						</form>
					</div>
				</div>
			)}
			{isLoading ? (
				<Loader />
			) : subjectsData?.length != 0 && subjectsData ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700'>ID</th>
							<th className='text-left p-2 border-b border-gray-700'>MONTH</th>
							<th className='text-left p-2 border-b border-gray-700'>
								MONTH_HALF
							</th>
							<th className='text-left p-2 border-b border-gray-700'>HOURS</th>
							<th className='text-left p-2 border-b border-gray-700'>PLAN</th>
						</tr>
					</thead>
					<tbody>
						{subjectsData.map(object => (
							<tr key={object.id}>
								<td className='p-2 border-b border-gray-700'>
									{`${object.id.slice(0, 5)}...`}
								</td>
								<td className='p-2 border-b border-gray-700'>{object.month}</td>
								<td className='p-2 border-b border-gray-700'>
									{object.monthHalf}
								</td>
								<td className='p-2 border-b border-gray-700'>{object.hours}</td>
								<td className='p-2 border-b border-gray-700'>
									{object.plan.year} {object.plan.rate}
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
