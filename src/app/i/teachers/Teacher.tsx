'use client'
import { useState } from 'react'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'
import { TeachersActions } from '@/components/teachers/TeachersActions'
import { TeachersCreateModal } from '@/components/teachers/TeachersCreateModal'
import { TeachersImportModal } from '@/components/teachers/TeachersImportModal'
import { TeachersTable } from '@/components/teachers/TeachersTable'

import { ITeacher} from '@/types/teacher.types'

import { useCreateTeachers } from '@/hooks/teachers/useCreateTeachers'
import { useDeleteTeachers } from '@/hooks/teachers/useDeleteTeachers'
import { useGetTeachers } from '@/hooks/teachers/useGetTeachers'
import { useImportTeachers } from '@/hooks/teachers/useImportTeachers'


export function Teachers() {
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data, isLoading } = useGetTeachers()
	const {
		actionType,
		handleModal,
		handleSubmit,
		modal,
		setModal,
		onSubmit,
		register,
		selectedTeacher
	} = useCreateTeachers()
	const { deleteTeacher } = useDeleteTeachers()
	const {
		handleFileChange,
		handleImportModal,
		importModal,
		isPending,
		setImportModal
	} = useImportTeachers()

	const filteredTeachers = data?.filter((teacher: ITeacher) =>
		teacher.fio.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<div className='my-3 h-0.5 bg-primary w-full' />
			<TeachersActions
				setSearchTerm={setSearchTerm}
				searchTerm={searchTerm}
				handleModal={handleModal}
				handleImportModal={handleImportModal}
			/>

			{modal && (
				<TeachersCreateModal
					actionType={actionType}
					setModal={setModal}
					onSubmit={onSubmit}
					register={register}
					selectedTeacher={selectedTeacher}
					deleteTeacher={deleteTeacher}
					handleSubmit={handleSubmit}
				/>
			)}

			{importModal && (
				<TeachersImportModal
					setImportModal={setImportModal}
					handleFileChange={handleFileChange}
					isPending={isPending}
				/>
			)}

			{isLoading ? (
				<Loader />
			) : filteredTeachers?.length !== 0 && filteredTeachers ? (
				<div className='overflow-x-auto'>
					<div className='overflow-y-auto max-h-[75vh]'>
						<TeachersTable
							filteredTeachers={filteredTeachers}
							handleModal={handleModal}
						/>
					</div>
				</div>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
