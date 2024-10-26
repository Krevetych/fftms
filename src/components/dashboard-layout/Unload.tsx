'use client'

import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { MONTH, MONTH_HALF, RATE, TERM } from '@/constants/table.constants'

import { ERate, IPlan, IUnloadPlans } from '@/types/plan.types'
import { EMonth, EMonthHalf, ETerm } from '@/types/subject.types'

import SelectInput from '../SelectInput'

import { planService } from '@/services/plan.service'

interface PlanForm {
	year: string
	rate: ERate
	term: ETerm
	month: EMonth
	monthHalf: EMonthHalf
}

export function Unload({ setModal }: { setModal: (value: boolean) => void }) {
	const { register, handleSubmit, watch, reset } = useForm<PlanForm>({
		mode: 'onChange'
	})
	const [filters, setFilters] = useState<IUnloadPlans>()

	const { data } = useQuery({
		queryKey: ['plans'],
		queryFn: () => planService.getAll()
	})

	const { isSuccess } = useQuery({
		queryKey: ['unload-plans', filters],
		queryFn: () => planService.unload(filters),
		enabled: !!filters
	})

	if (isSuccess) {
		toast.success('Данные выгружены')
		reset()
		setModal(false)
	}

	const uniqueYears = Array.from(new Set(data?.map((plan: IPlan) => plan.year)))

	const onSubmit: SubmitHandler<PlanForm> = data => {
		setFilters({
			year: data.year,
			rate: data.rate,
			term: data.term || '',
			month: data.month || '',
			monthHalf: data.monthHalf || ''
		})
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-bg p-4 rounded-lg shadow-lg'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-4'
				>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl font-black'>Импорт данных</h1>
						<X
							size={24}
							onClick={() => setModal(false)}
							className='rounded-full transition-colors cursor-pointer hover:bg-primary'
						/>
					</div>
					<SelectInput
						label='Выберите год'
						options={uniqueYears.map(year => ({
							value: year,
							label: year
						}))}
						{...register('year', { required: true })}
					/>
					<SelectInput
						label='Выберите тариф'
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
							{...register('term')}
						/>
					) : watch('rate') === ERate.HOURLY ? (
						<>
							<SelectInput
								label='Месяц'
								options={Object.entries(MONTH).map(([key, value]) => ({
									value: key as EMonth,
									label: value
								}))}
								{...register('month')}
							/>
							<SelectInput
								label='Половина месяца'
								options={Object.entries(MONTH_HALF).map(([key, value]) => ({
									value: key as EMonthHalf,
									label: value
								}))}
								{...register('monthHalf')}
							/>
						</>
					) : null}

					<button
						type='submit'
						className='w-full p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
					>
						Выгрузить
					</button>
				</form>
			</div>
		</div>
	)
}
