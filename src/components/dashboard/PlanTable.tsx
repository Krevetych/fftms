import { Ban } from 'lucide-react'
import { forwardRef } from 'react'
import { UseFormGetValues, UseFormRegister } from 'react-hook-form'

import {
	MONTH,
	MONTH_HALF,
	RATE,
	TERM,
	TYPE
} from '@/constants/table.constants'

import { EType } from '@/types/group.types'
import { ERate, IFilteredPlan } from '@/types/plan.types'
import { EMonth, EMonthHalf, ETerm } from '@/types/subject.types'

import { ISubjectForm } from '@/hooks/dashboard/useFiltered'

interface PlanTableProps {
	plans: IFilteredPlan[]
	editingSubject: string | null
	handleHoursClick: (subjectId: string) => void
	handleBlur: (subjectId: string, planId: string, hours: string) => void
	register: UseFormRegister<ISubjectForm>
	getValues: UseFormGetValues<ISubjectForm>
	rate: ERate
	handleCreateSubject: (
		subjectId: string,
		planId: string,
		term: ETerm,
		month: EMonth,
		monthHalf: EMonthHalf,
		hours: string
	) => Promise<void>
}

const PlanTable = forwardRef<HTMLTableElement, PlanTableProps>(
	({ plans, handleBlur, rate, register, getValues }, ref) => {
		return (
			<>
				<table
					className='w-full mt-4 border-collapse'
					ref={ref}
				>
					<thead>
						<tr>
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								Год
							</th>
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								Преподаватель
							</th>
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								Тариф
							</th>
							{rate === ERate.HOURLY ? (
								<>
									<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
										Месяц
									</th>
									<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
										Половина месяца
									</th>
								</>
							) : (
								<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
									Семестр
								</th>
							)}
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								Предмет
							</th>
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								Группа
							</th>
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								Тип
							</th>
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								Остаток часов
							</th>
							<th className='text-left p-2 border-b border-gray-700 sticky top-0 bg-card z-10'>
								Вычитанные часы
							</th>
						</tr>
					</thead>
					<tbody>
						{plans.map(plan => (
							<tr
								key={`${plan.id}-${getValues('month')}-${getValues('term')}`}
								className={
									plan.maxHours - plan.worked === 0 ? 'text-gray-600' : ''
								}
							>
								<td className='p-2 border-b border-gray-700'>{plan.year}</td>
								<td className='p-2 border-b border-gray-700'>
									{plan.teacher.fio}
								</td>
								<td className='p-2 border-b border-gray-700'>
									{RATE[plan.rate]}
								</td>
								{rate === ERate.HOURLY ? (
									<>
										<td className='p-2 border-b border-gray-700'>
											{MONTH[getValues('month') as EMonth]}
										</td>
										<td className='p-2 border-b border-gray-700'>
											{MONTH_HALF[getValues('monthHalf') as EMonthHalf]}
										</td>
									</>
								) : (
									<td className='p-2 border-b border-gray-700'>
										{TERM[getValues('term') as ETerm]}
									</td>
								)}
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
									{plan.maxHours - plan.worked}
								</td>

								{plan.Subject.length > 0 ? (
									plan.Subject.map(subject => (
										<td
											key={subject.id}
											className='p-2 border-b border-gray-700'
										>
											<div className='flex items-center gap-x-3'>
												{plan.maxHours - plan.worked === 0 ? (
													<Ban className='text-gray-600 ml-3' />
												) : (
													<input
														type='text'
														{...register(`subjects.${subject.id}.hours`)}
														className='p-3 w-full rounded-lg bg-card font-semibold placeholder:font-normal outline-none border-none'
														value={subject.hours || 0}
														onBlur={e =>
															handleBlur(subject.id, plan.id, e.target.value)
														}
													/>
												)}
											</div>
										</td>
									))
								) : plan.SubjectTerm.length > 0 ? (
									plan.SubjectTerm.map(subject => (
										<td
											key={subject.id}
											className='p-2 border-b border-gray-700'
										>
											<div className='flex items-center gap-x-3'>
												{plan.maxHours - plan.worked === 0 ? (
													<Ban className='text-gray-600 ml-3' />
												) : (
													<input
														type='text'
														{...register(`subjects.${subject.id}.hours`)}
														className='p-3 w-full rounded-lg bg-card font-semibold placeholder:font-normal outline-none border-none'
														value={subject.hours || 0}
														onBlur={e =>
															handleBlur(subject.id, plan.id, e.target.value)
														}
													/>
												)}
											</div>
										</td>
									))
								) : (
									<td className='p-2 border-b border-gray-700'>
										<div className='flex items-center gap-x-3'>
											{plan.maxHours - plan.worked === 0 ? (
												<Ban className='text-gray-600 ml-3' />
											) : (
												<input
													type='text'
													{...register(`subjects.${plan.id}.hours`)}
													placeholder='Введите часы'
													className='p-3 w-full rounded-lg bg-card font-semibold placeholder:font-normal outline-none border-none'
													onBlur={e =>
														handleBlur('new', plan.id, e.target.value)
													}
												/>
											)}
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</>
		)
	}
)

PlanTable.displayName = 'PlanTable'

export default PlanTable
