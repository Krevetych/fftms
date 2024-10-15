'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'

import { MONTH, MONTH_HALF, SUBJECT } from '@/constants/table.constants'

import { EMonth, EMonthHalf } from '@/types/subject.types'

import { subjectService } from '@/services/subject.service'
import { ERate } from '@/types/plan.types'

export function Subject({ rate }: { rate: ERate }) {
	const [modal, setModal] = useState(false)
	const [selectedSubject, setSelectedSubject] = useState<any | null>(null)

	const queryClient = useQueryClient()

	const { mutate: deleteSubject } = useMutation({
		mutationKey: ['subjects-delete'],
		mutationFn: (id: string) => subjectService.delete(id),
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
							{SUBJECT.map(subject => (
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
						{subjectsData.map(object => (
							<tr key={object.id}>
								<td className='p-2 border-b border-gray-700'>
									{MONTH[object.month as EMonth]}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{MONTH_HALF[object.monthHalf as EMonthHalf]}
								</td>
								<td className='p-2 border-b border-gray-700'>{object.hours}</td>
								<td className='p-2 border-b border-gray-700'>
									{object.plan.year} {object.plan.rate}
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
						))}
					</tbody>
				</table>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
