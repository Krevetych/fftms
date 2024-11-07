'use client'

import { Loader } from 'lucide-react'
import { useState } from 'react'

import NotFoundData from '@/components/NotFoundData'
import { GroupsActions } from '@/components/groups/GroupsActions'
import { GroupsCreateModal } from '@/components/groups/GroupsCreateModal'
import { GroupsFiltersForm } from '@/components/groups/GroupsFiltersForm'
import { GroupsImportModal } from '@/components/groups/GroupsImportModal'
import { GroupsTable } from '@/components/groups/GroupsTable'

import { IGroup } from '@/types/group.types'

import { useCreateGroup } from '@/hooks/groups/useCreateGroup'
import { useDeleteGroup } from '@/hooks/groups/useDeleteGroup'
import { useFilteredGroup } from '@/hooks/groups/useFilteredGroup'
import { useGetFilteredGroups } from '@/hooks/groups/useGetFilteredGroups'
import { useGetGroups } from '@/hooks/groups/useGetGroups'
import { useImportGroup } from '@/hooks/groups/useImportGroup'

export function Groups() {
	const [searchTerm, setSearchTerm] = useState<string>('')

	const {
		filters,
		filterHandleSubmit,
		onSubmitFiltered,
		filterRegister,
		resetFilters
	} = useFilteredGroup()
	const { fGroupsData } = useGetFilteredGroups({ filters })
	const { data, isLoading } = useGetGroups()
	const {
		handleModal,
		handleSubmit,
		onSubmit,
		actionType,
		setModal,
		modal,
		register,
		selectedGroup
	} = useCreateGroup()
	const {
		importModal,
		handleImportModal,
		handleFileChange,
		isPending,
		setImportModal
	} = useImportGroup()
	const { deleteGroup } = useDeleteGroup()

	const mapData =
		fGroupsData && fGroupsData?.length > 0 && filters
			? fGroupsData
			: fGroupsData?.length === 0 && filters
				? []
				: data

	const filteredGroups = mapData?.filter((group: IGroup) =>
		group.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<GroupsFiltersForm
				handleSubmit={filterHandleSubmit}
				onSubmit={onSubmitFiltered}
				resetFilters={resetFilters}
				filterRegister={filterRegister}
			/>

			<div className='my-3 h-0.5 bg-primary w-full' />

			<div className='flex justify-between overflow-y-hidden'>
				<div className='w-full'>
					<GroupsActions
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						handleModal={handleModal}
						handleImportModal={handleImportModal}
					/>

					{modal && (
						<GroupsCreateModal
							handleSubmit={handleSubmit}
							onSubmit={onSubmit}
							actionType={actionType}
							setModal={setModal}
							register={register}
							selectedGroup={selectedGroup}
							deleteGroup={deleteGroup}
						/>
					)}

					{importModal && (
						<GroupsImportModal
							setImportModal={setImportModal}
							isPending={isPending}
							handleFileChange={handleFileChange}
						/>
					)}

					{isLoading ? (
						<Loader />
					) : filteredGroups?.length !== 0 && filteredGroups ? (
						<div className='overflow-x-auto'>
							<div className='overflow-y-auto max-h-[68vh]'>
								<GroupsTable
									handleModal={handleModal}
									filteredGroups={filteredGroups}
								/>
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
