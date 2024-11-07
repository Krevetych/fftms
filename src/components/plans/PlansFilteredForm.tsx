import {
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister
} from 'react-hook-form'

import { RATE } from '@/constants/table.constants'

import { IGroup } from '@/types/group.types'
import { IObject } from '@/types/object.types'
import { ERate, IPlan, ISubjectForm } from '@/types/plan.types'
import { ITeacher } from '@/types/teacher.types'

import SelectInput from '../SelectInput'
import { Button } from '../dashboard-layout/Button'

interface IProps {
	filterHandleSubmit: UseFormHandleSubmit<ISubjectForm, undefined>
	onSubmit: SubmitHandler<ISubjectForm>
	data: IPlan[] | undefined
	teachersData: ITeacher[] | undefined
	filterRegister: UseFormRegister<ISubjectForm>
	isLoadingTeachers: boolean
	groupData: IGroup[] | undefined
	isLoadingGroups: boolean
	objectsData: IObject[] | undefined
	isLoadingObjects: boolean
	resetFilters: () => void
}

export function PlansFilteredForm({
	filterHandleSubmit,
	onSubmit,
	data,
	teachersData,
	filterRegister,
	isLoadingTeachers,
	groupData,
	isLoadingGroups,
	objectsData,
	isLoadingObjects,
	resetFilters
}: IProps) {
	const uniqueYears = Array.from(new Set(data?.map((plan: IPlan) => plan.year)))

	return (
		<form
			onSubmit={filterHandleSubmit(onSubmit)}
			className='flex bg-card justify-between gap-x-10 items-center max-w-max overflow-x-auto mx-5 mt-5'
		>
			<SelectInput
				label='Год'
				options={uniqueYears.map(year => ({
					value: year,
					label: year
				}))}
				{...filterRegister('year')}
			/>
			<SelectInput
				label='Преподаватель'
				options={
					teachersData?.map(teacher => ({
						value: teacher.id,
						label: teacher.fio
					})) || []
				}
				loading={isLoadingTeachers}
				{...filterRegister('teacherId')}
			/>
			<SelectInput
				label='Тариф'
				options={Object.entries(RATE).map(([rate, value]) => ({
					value: rate as ERate,
					label: value
				}))}
				{...filterRegister('rate')}
			/>

			<SelectInput
				label='Группа'
				options={
					groupData?.map(group => ({
						value: group.id,
						label: group.name
					})) || []
				}
				loading={isLoadingGroups}
				{...filterRegister('groupId')}
			/>
			<SelectInput
				label='Предмет'
				options={
					objectsData?.map(obj => ({
						value: obj.id,
						label: obj.name
					})) || []
				}
				loading={isLoadingObjects}
				{...filterRegister('objectId')}
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
