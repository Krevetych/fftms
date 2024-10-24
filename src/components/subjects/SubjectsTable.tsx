import { Trash } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

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
	ISubject,
	ISubjectTerm
} from '@/types/subject.types'

import { useProfile } from '@/hooks/useProfile'

interface IProps {
	rate: ERate
	filtererSubjects: (ISubject | ISubjectTerm)[]
	setSelectedSubject: Dispatch<any>
	setModal: Dispatch<SetStateAction<boolean>>
}

export function SubjectsTable({
	rate,
	filtererSubjects,
	setSelectedSubject,
	setModal
}: IProps) {
	const { data } = useProfile()

	const handleModal = (subject: any) => {
		setSelectedSubject(subject)
		setModal(true)
	}

	return (
		<table className='w-full mt-4 border-collapse'>
			<thead className='whitespace-nowrap'>
				<tr>
					{rate === ERate.HOURLY
						? SUBJECT.map(subject => (
								<th
									className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'
									key={subject.id}
								>
									{subject.title}
								</th>
							))
						: SUBJECT_RATE.map(subject => (
								<th
									className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'
									key={subject.id}
								>
									{subject.title}
								</th>
							))}
					{data?.isAdmin && (
						<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
							Действия
						</th>
					)}
				</tr>
			</thead>
			<tbody>
				{filtererSubjects.map(object => {
					const isSalaried = object.plan.rate !== ERate.SALARIED

					return (
						<tr key={object.id}>
							{isSalaried ? (
								<>
									<td className='p-2 border-b border-gray-700'>
										{MONTH[(object as ISubject).month as EMonth]}
									</td>
									<td className='p-2 border-b border-gray-700'>
										{MONTH_HALF[(object as ISubject).monthHalf as EMonthHalf]}
									</td>
								</>
							) : (
								<td className='p-2 border-b border-gray-700'>
									{TERM[(object as ISubjectTerm).term as ETerm]}
								</td>
							)}
							<td className='p-2 border-b border-gray-700'>{object.hours}</td>
							<td className='p-2 border-b border-gray-700'>
								{object.plan.Object.name}
							</td>
							<td className='p-2 border-b border-gray-700'>
								{object.plan.teacher.fio}
							</td>
							<td className='p-2 border-b border-gray-700'>
								{object.plan.group.name}
							</td>
							<td className='p-2 border-b border-gray-700'>
								{TYPE[object.plan.group.type as EType]}
							</td>
							<td className='p-2 border-b border-gray-700'>
								{object.plan.year}
							</td>
							{data?.isAdmin && (
								<td className='p-2 border-b border-gray-700'>
									<div className='flex gap-x-2'>
										<Trash
											size={20}
											onClick={() => handleModal(object)}
											className='cursor-pointer text-red-500 hover:text-red-700'
										/>
									</div>
								</td>
							)}
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
