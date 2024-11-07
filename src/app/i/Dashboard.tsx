'use client'

import { useState } from 'react'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'
import { Actions } from '@/components/dashboard/Actions'
import { FilteredForm } from '@/components/dashboard/FilteredForm'
import PlanTable from '@/components/dashboard/PlanTable'

import { ERate, IFilteredPlan, IPlan } from '@/types/plan.types'

import { useFPlans } from '@/hooks/dashboard/useFPlans'
import { useFiltered } from '@/hooks/dashboard/useFiltered'
import { useGetPlans } from '@/hooks/plans/useGetPlans'

export function Dashboard() {
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data: plansData } = useGetPlans()
	const {
		filters,
		handleBlur,
		onSubmit,
		handleSubmit,
		register,
		watch,
		resetFilters,
		editingSubject,
		getValues,
		handleCreateSubject,
		handleHoursClick
	} = useFiltered()
	const { fPlansData, isLoadingFPlans } = useFPlans({ filters })

	const filteredPlans = fPlansData?.filter((plan: IPlan) =>
		plan.teacher.fio.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const totalHours = filteredPlans?.reduce((total: number, plan) => {
		const subjectHours =
			watch('rate') === ERate.HOURLY
				? plan?.Subject?.reduce(
						(sum: number, subject) => sum + subject.hours,
						0
					) || 0
				: plan?.SubjectTerm?.reduce(
						(sum: number, subject) => sum + subject.hours,
						0
					) || 0

		return total + subjectHours
	}, 0)

	return (
		<>
			<FilteredForm
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				register={register}
				plansData={plansData}
				watch={watch}
				resetFilters={resetFilters}
			/>

			<div className='my-3 h-0.5 bg-primary w-full' />

			<div className='flex justify-between overflow-y-hidden'>
				<div className='w-full'>
					<div className='flex items-center justify-start'>
						<Actions
							setSearchTerm={setSearchTerm}
							searchTerm={searchTerm}
						/>
					</div>
					{isLoadingFPlans ? (
						<Loader />
					) : filteredPlans?.length ? (
						<div className='overflow-x-auto'>
							<div className='overflow-y-auto max-h-[68vh]'>
								<PlanTable
									plans={filteredPlans as IFilteredPlan[]}
									editingSubject={editingSubject}
									handleHoursClick={handleHoursClick}
									handleBlur={handleBlur}
									register={register}
									rate={watch('rate')}
									getValues={getValues}
									handleCreateSubject={handleCreateSubject}
								/>
							</div>
							<div className='absolute top-2 right-2 bg-card shadow-lg p-2 border border-solid border-primary rounded-xl'>
								<span className='font-semibold'>
									Итоговые часы: {totalHours}
								</span>
							</div>
						</div>
					) : (
						<NotFoundData />
					)}
				</div>
			</div>
		</>
	)
}
