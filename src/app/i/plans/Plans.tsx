'use client'

import { useState } from 'react'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'
import { PlanActions } from '@/components/plans/PlansActions'
import { PlansCreateModal } from '@/components/plans/PlansCreateModal'
import { PlansFilteredForm } from '@/components/plans/PlansFilteredForm'
import { PlansImportModal } from '@/components/plans/PlansImportModal'
import { PlansTable } from '@/components/plans/PlansTable'

import { IPlan } from '@/types/plan.types'

import { useGetGroups } from '@/hooks/groups/useGetGroups'
import { useGetObjects } from '@/hooks/objects/useGetObjects'
import { useCreatePlans } from '@/hooks/plans/useCreatePlans'
import { useDeletePlans } from '@/hooks/plans/useDeletePlans'
import { useFilteredPlans } from '@/hooks/plans/useFilteredPlans'
import { useGetPlans } from '@/hooks/plans/useGetPlans'
import { useImportPlans } from '@/hooks/plans/useImportPlans'
import { useGetTeachers } from '@/hooks/teachers/useGetTeachers'

export function Plans() {
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data: objectsData, isLoading: isLoadingObjects } = useGetObjects()
	const { data: teachersData, isLoading: isLoadingTeachers } = useGetTeachers()
	const { data: groupData, isLoading: isLoadingGroups } = useGetGroups()
	const { data, isLoading } = useGetPlans()
	const {
		fPlansData,
		filters,
		filterHandleSubmit,
		onSubmit,
		filterRegister,
		resetFilters
	} = useFilteredPlans()
	const {
		handleModal,
		modal,
		selectedPlan,
		actionType,
		createHandleSubmit,
		createRegister,
		onSubmitCreate,
		setModal
	} = useCreatePlans()
	const {
		handleImportModal,
		importModal,
		setImportModal,
		handleFileChange,
		isPending
	} = useImportPlans()
	const { deletePlan } = useDeletePlans()

	const mapData =
		fPlansData && fPlansData?.length > 0 && filters
			? fPlansData
			: fPlansData?.length === 0 && filters
				? []
				: data

	const filteredPlans = mapData?.filter((plan: IPlan) =>
		plan.teacher.fio.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const totalHours = filteredPlans
		?.map(plan => plan.maxHours || 0)
		.reduce((total, hours) => total + hours, 0)

	return (
		<>
			<PlansFilteredForm
				data={data}
				teachersData={teachersData}
				filterRegister={filterRegister}
				filterHandleSubmit={filterHandleSubmit}
				onSubmit={onSubmit}
				resetFilters={resetFilters}
				groupData={groupData}
				isLoadingTeachers={isLoadingTeachers}
				isLoadingGroups={isLoadingGroups}
				objectsData={objectsData}
				isLoadingObjects={isLoadingObjects}
			/>

			<div className='my-3 h-0.5 bg-primary w-full' />

			<div className='flex justify-between overflow-y-hidden'>
				<div className='w-full'>
					<PlanActions
						handleImportModal={handleImportModal}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						handleModal={handleModal}
					/>

					{modal && (
						<PlansCreateModal
							actionType={actionType}
							onSubmitCreate={onSubmitCreate}
							setModal={setModal}
							createHandleSubmit={createHandleSubmit}
							createRegister={createRegister}
							selectedPlan={selectedPlan}
							deletePlan={deletePlan}
							groupData={groupData}
							objectsData={objectsData}
							teachersData={teachersData}
							isLoadingGroups={isLoadingGroups}
							isLoadingObjects={isLoadingObjects}
							isLoadingTeachers={isLoadingTeachers}
						/>
					)}

					{importModal && (
						<PlansImportModal
							handleFileChange={handleFileChange}
							isPending={isPending}
							setImportModal={setImportModal}
						/>
					)}

					{isLoading ? (
						<Loader />
					) : filteredPlans?.length !== 0 && filteredPlans ? (
						<div className='overflow-x-auto'>
							<div className='overflow-y-auto max-h-[68vh]'>
								<PlansTable
									handleModal={handleModal}
									filteredPlans={filteredPlans}
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
