import { UseMutateFunction } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import {
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister
} from 'react-hook-form'

import { COURSE, TYPE } from '@/constants/table.constants'

import { ECourse, EType, IGroupCreate } from '@/types/group.types'

import Input from '../Input'
import SelectInput from '../SelectInput'
import { Button } from '../dashboard-layout/Button'

interface IProps {
	handleSubmit: UseFormHandleSubmit<IGroupCreate, undefined>
	onSubmit: SubmitHandler<IGroupCreate>
	actionType: 'delete' | 'edit' | 'create' | null
	setModal: Dispatch<SetStateAction<boolean>>
	register: UseFormRegister<IGroupCreate>
	selectedGroup: any
	deleteGroup: UseMutateFunction<
		boolean,
		AxiosError<unknown, any>,
		string,
		unknown
	>
}

export function GroupsCreateModal({
	handleSubmit,
	onSubmit,
	actionType,
	setModal,
	register,
	selectedGroup,
	deleteGroup
}: IProps) {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-bg p-4 rounded-lg shadow-lg'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-4'
				>
					<div className='flex items-center justify-between gap-x-10'>
						<h1 className='text-2xl font-black'>
							{actionType === 'edit'
								? 'Редактирование группы'
								: actionType === 'delete'
									? 'Удаление группы'
									: 'Создание группы'}
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
									{...register('name', { required: true })}
									type='text'
									placeholder='Группа'
								/>
								<div className='flex flex-col'>
									<SelectInput
										label='Курс'
										options={Object.entries(COURSE).map(([course, value]) => ({
											value: course as ECourse,
											label: value
										}))}
										{...register('course', { required: true })}
									/>
									<SelectInput
										label='Тип'
										{...register('type', { required: true })}
										options={Object.entries(TYPE).map(([type, value]) => ({
											value: type as EType,
											label: value
										}))}
									/>
								</div>
							</div>
							<Button
								type='submit'
								extra='w-full p-2 transition-colors bg-primary rounded-lg hover:bg-primary/80'
							>
								{actionType === 'edit' ? 'Сохранить изменения' : 'Создать'}
							</Button>
						</>
					) : (
						<div className='flex flex-col gap-2'>
							<p>
								Вы уверены, что хотите удалить группу{' '}
								<strong>{selectedGroup?.name}</strong>?
							</p>
							<Button
								type='button'
								extra='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
								onClick={() => {
									if (selectedGroup) {
										deleteGroup(selectedGroup.id)
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
