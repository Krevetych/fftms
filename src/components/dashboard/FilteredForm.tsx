import { watch } from 'fs'
import { register } from 'module'
import {
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister,
	UseFormWatch
} from 'react-hook-form'

import { MONTH, MONTH_HALF, RATE, TERM } from '@/constants/table.constants'

import { ERate, IPlan } from '@/types/plan.types'
import { EMonth, EMonthHalf, ETerm } from '@/types/subject.types'

import { ISubjectForm } from '@/hooks/dashboard/useFiltered'

import SelectInput from '../SelectInput'
import { Button } from '../dashboard-layout/Button'

interface IProps {
	handleSubmit: UseFormHandleSubmit<ISubjectForm, undefined>
	onSubmit: SubmitHandler<ISubjectForm>
	register: UseFormRegister<ISubjectForm>
	plansData: IPlan[] | undefined
	watch: UseFormWatch<ISubjectForm>
	resetFilters: () => void
}

export function FilteredForm({
	handleSubmit,
	onSubmit,
	register,
	plansData,
	watch,
	resetFilters
}: IProps) {
	const uniqueYears = Array.from(
		new Set(plansData?.map((plan: IPlan) => plan.year))
	)

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex bg-card justify-between gap-x-10 items-center w-fit mx-5 mt-5'
		>
			<SelectInput
				label='Год'
				options={uniqueYears.map(year => ({
					value: year,
					label: year
				}))}
				{...register('year', { required: true })}
			/>
			<SelectInput
				label='Тариф'
				options={Object.entries(RATE).map(([rate, value]) => ({
					value: rate as ERate,
					label: value
				}))}
				{...register('rate', { required: true })}
			/>
			{watch('rate') === ERate.SALARIED ? (
				<SelectInput
					label='Семестр'
					options={Object.entries(TERM).map(([term, value]) => ({
						value: term as ETerm,
						label: value
					}))}
					{...register('term', { required: true })}
				/>
			) : watch('rate') === ERate.HOURLY ? (
				<>
					<SelectInput
						label='Месяц'
						options={Object.entries(MONTH).map(([key, value]) => ({
							value: key as EMonth,
							label: value
						}))}
						{...register('month', { required: true })}
					/>
					<SelectInput
						label='Половина месяца'
						options={Object.entries(MONTH_HALF).map(([key, value]) => ({
							value: key as EMonthHalf,
							label: value
						}))}
						{...register('monthHalf', { required: true })}
					/>
				</>
			) : null}
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
