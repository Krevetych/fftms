import { register } from 'module'
import {
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister
} from 'react-hook-form'

import { MONTH, MONTH_HALF, TERM, TYPE } from '@/constants/table.constants'

import { EType, IGroup } from '@/types/group.types'
import { ERate } from '@/types/plan.types'
import {
	EMonth,
	EMonthHalf,
	ETerm,
	IForm,
	ITermForm
} from '@/types/subject.types'
import { ITeacher } from '@/types/teacher.types'

import SelectInput from '../SelectInput'
import { Button } from '../dashboard-layout/Button'

interface IProps {
	handleSubmit: UseFormHandleSubmit<ITermForm | IForm, undefined>
	onSubmit: SubmitHandler<ITermForm | IForm>
	rate: ERate
	register: UseFormRegister<ITermForm | IForm>
	teachersData: ITeacher[] | undefined
	groupData: IGroup[] | undefined
	resetFilters: () => void
}

export function SubjectsFilteredForm({
	handleSubmit,
	onSubmit,
	rate,
	register,
	teachersData,
	groupData,
	resetFilters
}: IProps) {
	return (
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
				{...register('groupId')}
			/>
			<div className='flex gap-x-2'>
				<Button
					type='submit'
					extra='w-full p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
				>
					Применить
				</Button>
				<Button
					type='button'
					onClick={resetFilters}
					extra='w-full p-2 transition-colors bg-secondary rounded-lg hover:bg-secondary/80'
				>
					Сбросить
				</Button>
			</div>
		</form>
	)
}
