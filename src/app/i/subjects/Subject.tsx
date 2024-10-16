'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { group } from 'console'
import { Loader, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'

import {
	MONTH,
	MONTH_HALF,
	RATE,
	SUBJECT,
	SUBJECT_RATE,
	TERM
} from '@/constants/table.constants'

import { ERate } from '@/types/plan.types'
import {
	EMonth,
	EMonthHalf,
	ETerm,
	ISubject,
	ISubjectTerm
} from '@/types/subject.types'

import { subjectService } from '@/services/subject.service'

export function Subject({ rate }: { rate: ERate }) {
	const [modal, setModal] = useState(false)
	const [selectedSubject, setSelectedSubject] = useState<any | null>(null)

	const queryClient = useQueryClient()

	const { mutate: deleteSubject } = useMutation({
		mutationKey: ['subjects-delete', rate],
		mutationFn: (id: string) => subjectService.delete(id, rate),
		onSuccess: () => {
			toast.success('Запись удалена')
			queryClient.invalidateQueries({ queryKey: ['subjects'] })
		}
	})

	const { data: subjectsData, isLoading } = useQuery({
		queryKey: ['subjects', rate],
		queryFn: () => {
			return subjectService.getByRate(rate)
		}
	})

	const handleModal = (subject: any) => {
		setSelectedSubject(subject)
		setModal(true)
	}

	return (
		<>
			{modal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-bg p-4 rounded-lg shadow-lg'>
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
					</div>
				</div>
			)}

			{isLoading ? (
				<Loader />
			) : subjectsData?.length !== 0 && subjectsData ? (
				<table className='w-full mt-4 border-collapse'>
					<thead>
						<tr>
							{rate === ERate.HOURLY
								? SUBJECT.map(subject => (
										<th
											className='text-left p-2 border-b border-gray-700'
											key={subject.id}
										>
											{subject.title}
										</th>
									))
								: SUBJECT_RATE.map(subject => (
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
						{subjectsData.map(object => {
							const isSalaried = object.plan.rate !== ERate.SALARIED

							return (
								<tr key={object.id}>
									{isSalaried ? (
										<>
											<td className='p-2 border-b border-gray-700'>
												{MONTH[(object as ISubject).month as EMonth]}
											</td>
											<td className='p-2 border-b border-gray-700'>
												{
													MONTH_HALF[
														(object as ISubject).monthHalf as EMonthHalf
													]
												}
											</td>
										</>
									) : (
										<td className='p-2 border-b border-gray-700'>
											{TERM[(object as ISubjectTerm).term as ETerm]}
										</td>
									)}
									<td className='p-2 border-b border-gray-700'>
										{object.hours}
									</td>
									<td className='p-2 border-b border-gray-700'>
										<div className='relative group cursor-pointer'>
											<span className='block overflow-hidden whitespace-nowrap text-ellipsis max-w-[20ch]'>
												{object.plan.year}-{RATE[object.plan.rate as ERate]}-
												{object.plan.teacher.fio}-{object.plan.group.name}-
												{object.plan.Object.name}
											</span>
											<span className='absolute left-0 w-full bg-card text-text transition-opacity font-semibold border border-solid border-primary duration-500 opacity-0 group-hover:opacity-100 mt-2 z-10 p-2 rounded shadow-lg'>
												{object.plan.year}-{RATE[object.plan.rate as ERate]}-
												{object.plan.teacher.fio}-{object.plan.group.name}-
												{object.plan.Object.name}
											</span>
										</div>
									</td>
									<td className='p-2 border-b border-gray-700'>
										<div className='flex gap-x-2'>
											<Trash
												size={20}
												onClick={() => handleModal(object)}
												className='cursor-pointer text-red-500 hover:text-red-700'
											/>
										</div>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
