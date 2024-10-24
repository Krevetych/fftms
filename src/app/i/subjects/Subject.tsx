'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Trash } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import NotFoundData from '@/components/NotFoundData'
import SelectInput from '@/components/SelectInput'

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
	ISubject,
	ISubjectTerm
} from '@/types/subject.types'

import { useProfile } from '@/hooks/useProfile'

import { groupService } from '@/services/group.service'
import { subjectService } from '@/services/subject.service'
import { teacherService } from '@/services/teacher.service'

interface IForm {
	month: EMonth
	monthHalf: EMonthHalf
	teacherId: string
	type: EType
	groupId: string
}

interface ITermForm {
	term: ETerm
	teacherId: string
	type: EType
	groupId: string
}

export function Subject({ rate }: { rate: ERate }) {
	const { register, handleSubmit, reset, setValue } = useForm<
		ITermForm | IForm
	>({
		mode: 'onChange'
	})

	const [modal, setModal] = useState(false)
	const [filters, setFilters] = useState<
		IFilteredSubject | IFilteredSubjectTerm | undefined
	>()
	const [selectedSubject, setSelectedSubject] = useState<any | null>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data } = useProfile()

	const queryClient = useQueryClient()

	const { data: fSubjectData } = useQuery({
		queryKey: ['filtered-subject', filters],
		queryFn: () =>
			filters ? subjectService.getFiltered(filters as IForm) : [],
		enabled: !!filters && rate === ERate.HOURLY
	})

	const { data: fSubjectTermData } = useQuery({
		queryKey: ['filtered-subject-term', filters],
		queryFn: () =>
			filters ? subjectService.getFilteredTerm(filters as ITermForm) : [],
		enabled: !!filters && rate !== ERate.HOURLY
	})

	const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
		queryKey: ['teachers'],
		queryFn: () => teacherService.getAll()
	})

	const { data: groupData, isLoading: isLoadingGroups } = useQuery({
		queryKey: ['groups'],
		queryFn: () => groupService.getAll()
	})

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

	const onSubmit: SubmitHandler<IForm | ITermForm> = data => {
		if (rate === ERate.HOURLY) {
			const formData = data as IForm
			setFilters({
				month: formData.month || '',
				monthHalf: formData.monthHalf || '',
				teacherId: formData.teacherId || '',
				type: formData.type || '',
				groupId: formData.groupId || ''
			})
		} else {
			const formData = data as ITermForm
			setFilters({
				term: formData.term || '',
				teacherId: formData.teacherId || '',
				type: formData.type || '',
				groupId: formData.groupId || ''
			})
		}
	}

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

	const resetFilters = () => {
		reset()
		setFilters(undefined)
	}

	const filtererSubjects = mapData?.filter((subject: ISubject | ISubjectTerm) =>
		subject.plan.teacher.fio.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex bg-card justify-between gap-x-10 items-center w-fit mx-5 mt-5'
			>
				{rate === ERate.SALARIED ? (
					<SelectInput
						label='Семестр'
						options={Object.entries(TERM).map(([term, value]) => ({
							value: term as ETerm,
							label: value
						}))}
						{...register('term')}
					/>
				) : (
					<>
						<SelectInput
							label='Месяц'
							options={Object.entries(MONTH).map(([month, value]) => ({
								value: month as EMonth,
								label: value
							}))}
							{...register('month')}
						/>
						<SelectInput
							label='Половина месяца'
							options={Object.entries(MONTH_HALF).map(([monthHalf, value]) => ({
								value: monthHalf as EMonthHalf,
								label: value
							}))}
							{...register('monthHalf')}
						/>
					</>
				)}
				<SelectInput
					label='Тип группы'
					options={Object.entries(TYPE).map(([type, value]) => ({
						value: type as EType,
						label: value
					}))}
					{...register('type')}
				/>
				<SelectInput
					label='Преподаватель'
					options={
						teachersData?.map(obj => ({
							value: obj.id,
							label: obj.fio
						})) || []
					}
					loading={isLoadingTeachers}
					{...register('teacherId')}
				/>

				<SelectInput
					label='Группа'
					options={
						groupData?.map(obj => ({
							value: obj.id,
							label: obj.name
						})) || []
					}
					loading={isLoadingGroups}
					{...register('groupId')}
				/>
				<div className='flex gap-x-2'>
					<button
						type='submit'
						className='w-full p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
					>
						Применить
					</button>
					<button
						type='button'
						onClick={resetFilters}
						className='w-full p-2 transition-colors bg-secondary rounded-lg hover:bg-secondary/80'
					>
						Сбросить
					</button>
				</div>
			</form>

			<div className='my-3 h-0.5 bg-primary w-full' />

			<div className='flex justify-between overflow-y-hidden'>
				<div className='w-full'>
					<div className='flex items-center justify-start'>
						<div className='flex gap-x-2 mb-4'>
							<input
								type='text'
								placeholder='Поиск по ФИО'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-transparent border border-solid focus:border-primary text-ellipsis overflow-hidden whitespace-nowrap'
								style={{ maxWidth: '100%', overflow: 'hidden' }}
							/>
						</div>
					</div>

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
					) : filtererSubjects?.length !== 0 && filtererSubjects ? (
						<div className='overflow-x-auto'>
							<div className='overflow-y-auto max-h-[70vh]'>
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
