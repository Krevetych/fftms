'use client'

import { useQuery } from '@tanstack/react-query'
import { group, table } from 'console'
import { type } from 'os'
import { join, resolve } from 'path'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import NotFoundData from '@/components/NotFoundData'

import { MONTH, MONTH_HALF, TYPE } from '@/constants/table.constants'

import { EType } from '@/types/group.types'
import { IFilters, IPlan } from '@/types/plan.types'

import { planService } from '@/services/plan.service'
import { teacherService } from '@/services/teacher.service'

export function Dashboard() {
	const { register, handleSubmit, reset } = useForm<IFilters>({
		mode: 'onChange'
	})

	const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => {
			return teacherService.getAll()
		}
	})

	const { data: plansData, isLoading: isLoadingPlans } = useQuery({
		queryKey: ['plans'],
		queryFn: () => {
			return planService.getAll()
		}
	})

	const uniqueYears = Array.from(
		new Set(plansData?.map((plan: IPlan) => plan.year))
	)

	const [filters, setFilters] = useState<IFilters>()

	const {
		data: fPlansData,
		isLoading: isLoadingFPlans,
		refetch
	} = useQuery({
		queryKey: ['f-plans', filters],
		queryFn: () => {
			if (!filters) return Promise.resolve([])
			return planService.getFiltered(filters)
		},
		enabled: !!filters
	})

	const onSubmit: SubmitHandler<IFilters> = data => {
		setFilters(data)
		reset()
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-y-2'
			>
				<div className='flex justify-between'>
					<div>
						<select
							{...register('year')}
							className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						>
							<option value=''>Выберите год</option>
							{uniqueYears.map(year => (
								<option
									key={year}
									value={year}
								>
									{year}
								</option>
							))}
						</select>

						<select
							id='teacher'
							{...register('teacher')}
							className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						>
							<option value=''>Выберите преподавателя</option>
							{isLoadingTeachers ? (
								<option>Загрузка...</option>
							) : (
								teachersData?.map(teacher => (
									<option
										key={teacher.id}
										value={teacher.fio}
									>
										{teacher.fio}
									</option>
								))
							)}
						</select>
					</div>

					<div>
						<select
							id='month'
							{...register('month')}
							className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						>
							<option value=''>Выберите месяц</option>
							{Object.entries(MONTH).map(([key, value]) => (
								<option
									key={key}
									value={key}
								>
									{value}
								</option>
							))}
						</select>
						<select
							id='monthHalf'
							{...register('monthHalf')}
							className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
						>
							<option value=''>Выберите половину месяца</option>
							{Object.entries(MONTH_HALF).map(([key, value]) => (
								<option
									key={key}
									value={key}
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
					Применить
				</button>
			</form>
			{isLoadingFPlans ? (
				<p>Загрузка отфильтрованных планов...</p>
			) : fPlansData && fPlansData.length > 0 ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700'>
								Предмет
							</th>
							<th className='text-left p-2 border-b border-gray-700'>Группа</th>
							<th className='text-left p-2 border-b border-gray-700'>Тип</th>
							<th className='text-left p-2 border-b border-gray-700'>
								Остаток часов
							</th>
							<th className='text-left p-2 border-b border-gray-700'>
								Вычитанные часы
							</th>
						</tr>
					</thead>
					<tbody>
						{fPlansData.map(plan =>
							plan.Subject.map(subject => (
								<tr key={subject.id}>
									<td className='p-2 border-b border-gray-700'>
										{plan.Object.name}
									</td>
									<td className='p-2 border-b border-gray-700'>
										{plan.group.name}
									</td>
									<td className='p-2 border-b border-gray-700'>
										{TYPE[plan.group.type as EType]}
									</td>
									<td className='p-2 border-b border-gray-700'>
										{plan.maxHours}
									</td>
									<td className='p-2 border-b border-gray-700'>
										{subject.hours}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
