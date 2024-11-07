import {
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister
} from 'react-hook-form'

import { COURSE, TYPE } from '@/constants/table.constants'

import { ECourse, EType, ISubjectForm } from '@/types/group.types'

import SelectInput from '../SelectInput'
import { Button } from '../dashboard-layout/Button'

interface IProps {
	handleSubmit: UseFormHandleSubmit<ISubjectForm, undefined>
	onSubmit: SubmitHandler<ISubjectForm>
	resetFilters: () => void
	filterRegister: UseFormRegister<ISubjectForm>
}

export function GroupsFiltersForm({
	handleSubmit,
	onSubmit,
	resetFilters,
	filterRegister,
	...rest
}: IProps) {
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex bg-card justify-between gap-x-10 items-center w-fit mx-5 mt-5'
		>
			<SelectInput
				label='Тип группы'
				options={Object.entries(TYPE).map(([type, value]) => ({
					value: type as EType,
					label: value
				}))}
				{...filterRegister('type')}
			/>
			<SelectInput
				label='Курс'
				options={Object.entries(COURSE).map(([course, value]) => ({
					value: course as ECourse,
					label: value
				}))}
				{...filterRegister('course')}
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
