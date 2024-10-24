import { UseMutateFunction } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { X } from 'lucide-react'
import { register } from 'module'
import { Dispatch, SetStateAction } from 'react'
import {
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister
} from 'react-hook-form'

import { ITeacher, ITeacherCreate } from '@/types/teacher.types'

import Input from '../Input'
import { Button } from '../dashboard-layout/Button'

interface IProps {
	handleSubmit: UseFormHandleSubmit<ITeacherCreate, undefined>
	onSubmit: SubmitHandler<ITeacherCreate>
	actionType: 'delete' | 'edit' | 'create' | null
	setModal: Dispatch<SetStateAction<boolean>>
	register: UseFormRegister<ITeacherCreate>
	selectedTeacher: ITeacher | null
	deleteTeacher: UseMutateFunction<
		boolean,
		AxiosError<unknown, any>,
		string,
		unknown
	>
}

export function TeachersCreateModal({
	handleSubmit,
	onSubmit,
	actionType,
	setModal,
	register,
	selectedTeacher,
	deleteTeacher
}: IProps) {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-bg p-4 rounded-lg shadow-lg'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-4'
				>
					<div className='flex items-center gap-x-4'>
						<h1 className='text-2xl font-black'>
							{actionType === 'edit'
								? 'Редактирование преподавателя'
								: actionType === 'delete'
									? 'Удаление преподавателя'
									: 'Создание преподавателя'}
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
									{...register('fio', { required: true })}
									type='text'
									placeholder='ФИО'
								/>
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
								Вы уверены, что хотите удалить преподавателя{' '}
								{selectedTeacher?.fio}?
							</p>
							<Button
								type='button'
								extra='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
								onClick={() => {
									if (selectedTeacher) {
										deleteTeacher(selectedTeacher.id)
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
