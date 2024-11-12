import { UseMutateFunction } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import {
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister
} from 'react-hook-form'

import { RATE } from '@/constants/table.constants'

import { IGroup } from '@/types/group.types'
import { IObject } from '@/types/object.types'
import { ERate, IPlanCreate } from '@/types/plan.types'
import { ITeacher } from '@/types/teacher.types'

import Input from '../Input'
import Loader from '../Loader'
import SelectInput from '../SelectInput'
import { Button } from '../dashboard-layout/Button'

interface IProps {
	createHandleSubmit: UseFormHandleSubmit<IPlanCreate, undefined>
	onSubmitCreate: SubmitHandler<IPlanCreate>
	actionType: 'delete' | 'edit' | 'create' | null
	createRegister: UseFormRegister<IPlanCreate>
	setModal: Dispatch<SetStateAction<boolean>>
	isLoadingObjects: boolean
	objectsData: IObject[] | undefined
	isLoadingTeachers: boolean
	teachersData: ITeacher[] | undefined
	isLoadingGroups: boolean
	groupData: IGroup[] | undefined
	selectedPlan: any
	deletePlan: UseMutateFunction<
		boolean,
		AxiosError<unknown, any>,
		string,
		unknown
	>
}

export function PlansCreateModal({
	createHandleSubmit,
	onSubmitCreate,
	actionType,
	createRegister,
	setModal,
	objectsData,
	teachersData,
	groupData,
	selectedPlan,
	deletePlan
}: IProps) {
	const year = () => {
		const year = new Date().getFullYear()
		return `${year}-${year + 1}`
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-bg p-4 rounded-lg shadow-lg'>
				<form
					onSubmit={createHandleSubmit(onSubmitCreate)}
					className='flex flex-col gap-4'
				>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl font-black'>
							{actionType === 'edit'
								? 'Редактирование учебного плана'
								: actionType === 'delete'
									? 'Удаление учебного плана'
									: 'Создание учебного плана'}
						</h1>
						<X
							size={24}
							onClick={() => setModal(false)}
							className='rounded-full transition-colors cursor-pointer hover:bg-primary'
						/>
					</div>

					{actionType !== 'delete' ? (
						<>
							<div className='flex flex-col gap-2'>
								<Input
									{...createRegister('year', { required: true })}
									type='text'
									placeholder='Учебный год'
									defaultValue={year()}
								/>
								<SelectInput
									label='Тариф'
									{...createRegister('rate', { required: true })}
									options={Object.entries(ERate).map(([rate, value]) => ({
										value: rate as ERate,
										label: RATE[value]
									}))}
								/>

								<Input
									{...createRegister('maxHours', { required: true })}
									type='text'
									placeholder='Макс. кол-во часов'
								/>

								{actionType === 'edit' ? (
									<>
										<Input
											type='text'
											value={selectedPlan?.Object.name}
											placeholder='Предмет'
											readOnly
										/>
										<Input
											type='hidden'
											{...createRegister('objectId')}
											value={selectedPlan?.Object.id}
											placeholder='Предмет'
										/>

										<Input
											type='text'
											value={selectedPlan?.teacher.fio}
											placeholder='Преподаватель'
											readOnly
										/>
										<Input
											type='hidden'
											{...createRegister('teacherId')}
											placeholder='Преподаватель'
											value={selectedPlan?.teacher.id}
										/>

										<Input
											type='text'
											value={selectedPlan?.group.name}
											placeholder='Группа'
											readOnly
										/>
										<Input
											type='hidden'
											{...createRegister('groupId')}
											value={selectedPlan?.group.id}
											placeholder='Группа'
										/>
									</>
								) : (
									<>
										<SelectInput
											label='Предмет'
											{...createRegister('objectId', { required: true })}
											options={objectsData?.map(object => ({
												value: object.id,
												label: object.name
											}))}
										/>

										<SelectInput
											label='Преподаватель'
											{...createRegister('teacherId', { required: true })}
											options={teachersData?.map(teacher => ({
												value: teacher.id,
												label: teacher.fio
											}))}
										/>

										<SelectInput
											label='Группа'
											{...createRegister('groupId', { required: true })}
											options={groupData?.map(group => ({
												value: group.id,
												label: group.name
											}))}
										/>
									</>
								)}
							</div>
							<Button
								type='submit'
								extra='w-fit p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
							>
								{actionType === 'edit' ? 'Сохранить изменения' : 'Создать'}
							</Button>
						</>
					) : (
						<div className='flex flex-col gap-2'>
							<p>
								Вы уверены, что хотите удалить план{' '}
								<strong>{selectedPlan?.year}</strong>?
							</p>
							<Button
								type='button'
								extra='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
								onClick={() => {
									if (selectedPlan) {
										deletePlan(selectedPlan.id)
										setModal(false)
									}
								}}
							>
								Удалить
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	)
}
