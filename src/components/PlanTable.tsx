import { Check } from 'lucide-react'
import { forwardRef } from 'react'
import { UseFormGetValues, UseFormRegister } from 'react-hook-form'

import { TYPE } from '@/constants/table.constants'

import { EType } from '@/types/group.types'
import { ERate, IFilteredPlan } from '@/types/plan.types'
import { EMonth, EMonthHalf, ETerm, ISubject } from '@/types/subject.types'

import { ISubjectForm } from '@/app/i/Dashboard'

interface PlanTableProps {
	plans: IFilteredPlan[]
	editingSubject: string | null
	handleHoursClick: (subjectId: string) => void
	handleBlur: (subjectId: string, planId: string) => void
	register: UseFormRegister<ISubjectForm>
	getValues: UseFormGetValues<ISubjectForm>
	rate: ERate
	handleCreateSubject: (
		subjectId: string,
		planId: string,
		term: ETerm,
		month: EMonth,
		monthHalf: EMonthHalf
	) => Promise<void>
}

const PlanTable = forwardRef<HTMLTableElement, PlanTableProps>(
	(
		{
			plans,
			editingSubject,
			handleHoursClick,
			handleBlur,
			rate,
			register,
			getValues,
			handleCreateSubject
		},
		ref
	) => {
		const totalHours: number = plans.reduce((total: number, plan) => {
			const subjectHours =
				rate === ERate.HOURLY
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
				<table
					ref={ref}
					className='w-full mt-4 border-collapse'
				>
					<thead>
						<tr>
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
							<tr key={plan.id}>
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
												{editingSubject === subject.id ? (
													<>
														<input
															type='text'
															{...register(`subjects.${subject.id}.hours`, {
																required: true
															})}
															className='p-3 w-1/2 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal outline-none border-none'
															defaultValue={subject.hours}
															onBlur={() => handleBlur(subject.id, plan.id)}
														/>
														<Check
															onClick={async () =>
																await handleCreateSubject(
																	subject.id,
																	plan.id,
																	getValues('term') as ETerm,
																	getValues('month') as EMonth,
																	getValues('monthHalf') as EMonthHalf
																)
															}
															className='cursor-pointer text-primary hover:text-primary/80'
														/>
													</>
												) : (
													<span onClick={() => handleHoursClick(subject.id)}>
														{subject.hours}
													</span>
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
												{editingSubject === subject.id ? (
													<>
														<input
															type='text'
															{...register(`subjects.${subject.id}.hours`, {
																required: true
															})}
															className='p-3 w-1/2 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal outline-none border-none'
															defaultValue={subject.hours}
															onBlur={() => handleBlur(subject.id, plan.id)}
														/>
														<Check
															onClick={async () =>
																await handleCreateSubject(
																	subject.id,
																	plan.id,
																	getValues('term') as ETerm,
																	getValues('month') as EMonth,
																	getValues('monthHalf') as EMonthHalf
																)
															}
															className='cursor-pointer text-primary hover:text-primary/80'
														/>
													</>
												) : (
													<span onClick={() => handleHoursClick(subject.id)}>
														{subject.hours}
													</span>
												)}
											</div>
										</td>
									))
								) : (
									<td className='p-2 border-b border-gray-700'>
										<div className='flex items-center gap-x-3'>
											<input
												type='text'
												{...register(`subjects.new.hours`, { required: true })}
												placeholder='Введите часы'
												className='p-3 w-1/2 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal outline-none border-none'
											/>
											<Check
												onClick={async () =>
													await handleCreateSubject(
														'new',
														plan.id,
														getValues('term') as ETerm,
														getValues('month') as EMonth,
														getValues('monthHalf') as EMonthHalf
													)
												}
												className='cursor-pointer text-primary hover:text-primary/80'
											/>
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
				<div className='absolute bottom-0 left-0 right-0 bg-card shadow-lg p-4'>
					<div className='flex font-semibold text-lg gap-x-4 justify-start'>
						<span>Итоговые часы:</span>
						<span>{totalHours}</span>
					</div>
				</div>
			</>
		)
	}
)

export default PlanTable
