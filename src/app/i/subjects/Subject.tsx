'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Trash } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'
import SelectInput from '@/components/SelectInput'
import { SubjectsActions } from '@/components/subjects/SubjectsActions'
import { SubjectsFilteredForm } from '@/components/subjects/SubjectsFilteredForm'
import { SubjectsFilteredModal } from '@/components/subjects/SubjectsFilteredModal'
import { SubjectsTable } from '@/components/subjects/SubjectsTable'

import {
	MONTH,
	MONTH_HALF,
	SUBJECT,
	SUBJECT_RATE,
	TERM,
	TYPE
} from '@/constants/table.constants'

import { EType } from '@/types/group.types'
import { ERate } from '@/types/plan.types'
import {
	EMonth,
	EMonthHalf,
	ETerm,
	IFilteredSubject,
	IFilteredSubjectTerm,
	IForm,
	ISubject,
	ISubjectTerm,
	ITermForm
} from '@/types/subject.types'

import { useGetGroups } from '@/hooks/groups/useGetGroups'
import { useDeleteSubjects } from '@/hooks/subjects/useDeleteSubjects'
import { useFilteredSubjects } from '@/hooks/subjects/useFilteredSubjects'
import { useGetSubjects } from '@/hooks/subjects/useGetSubjects'
import { useGetSubjectsRate } from '@/hooks/subjects/useGetSubjectsRate'
import { useGetSubjectsTerm } from '@/hooks/subjects/useGetSubjectsTerm'
import { useGetTeachers } from '@/hooks/teachers/useGetTeachers'
import { useProfile } from '@/hooks/useProfile'

import { groupService } from '@/services/group.service'
import { subjectService } from '@/services/subject.service'
import { teacherService } from '@/services/teacher.service'

export function Subject({ rate }: { rate: ERate }) {
	const [modal, setModal] = useState(false)
	const [selectedSubject, setSelectedSubject] = useState<any | null>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data: teachersData } = useGetTeachers()

	const { data: groupData } = useGetGroups()
	const { filters, handleSubmit, onSubmit, register, resetFilters } =
		useFilteredSubjects({
			rate
		})
	const { fSubjectData } = useGetSubjects({ filters: filters || {}, rate })
	const { fSubjectTermData } = useGetSubjectsTerm({
		filters: filters || {},
		rate
	})
	const { subjectsData, isLoading } = useGetSubjectsRate({ rate })
	const { deleteSubject } = useDeleteSubjects({ rate })

	const mapData =
		rate === ERate.HOURLY &&
		fSubjectData &&
		fSubjectData.length > 0 &&
		filters === (filters as IForm)
			? fSubjectData
			: rate === ERate.SALARIED &&
				  fSubjectTermData &&
				  fSubjectTermData.length > 0 &&
				  filters === (filters as ITermForm)
				? fSubjectTermData
				: (fSubjectData?.length === 0 && filters === (filters as IForm)) ||
					  (fSubjectTermData?.length === 0 &&
							filters === (filters as ITermForm))
					? []
					: subjectsData

	const filtererSubjects = mapData?.filter((subject: ISubject | ISubjectTerm) =>
		subject.plan.teacher.fio.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<SubjectsFilteredForm
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				rate={rate}
				register={register}
				teachersData={teachersData}
				groupData={groupData}
				resetFilters={resetFilters}
			/>

			<div className='my-3 h-0.5 bg-primary w-full' />

			<div className='flex justify-between overflow-y-hidden'>
				<div className='w-full'>
					<SubjectsActions
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>

					{modal && (
						<SubjectsFilteredModal
							selectedSubject={selectedSubject}
							setModal={setModal}
							deleteSubject={deleteSubject}
						/>
					)}

					{isLoading ? (
						<Loader />
					) : filtererSubjects?.length !== 0 && filtererSubjects ? (
						<div className='overflow-x-auto'>
							<div className='overflow-y-auto max-h-[70vh]'>
								<SubjectsTable
									rate={rate}
									filtererSubjects={filtererSubjects}
									setSelectedSubject={setSelectedSubject}
									setModal={setModal}
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
