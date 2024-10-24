import { UseMutateFunction } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'

import { Button } from '../dashboard-layout/Button'

interface IProps {
	selectedSubject: any
	setModal: Dispatch<SetStateAction<boolean>>
	deleteSubject: UseMutateFunction<boolean, Error, string, unknown>
}

export function SubjectsFilteredModal({
	selectedSubject,
	setModal,
	deleteSubject
}: IProps) {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-bg p-4 rounded-lg shadow-lg'>
				<div className='flex flex-col gap-2'>
					<p>
						Вы уверены, что хотите удалить вычитанные часы{' '}
						<strong>{selectedSubject?.hours}</strong>?
					</p>
					<Button
						type='button'
						extra='w-fit p-2 transition-colors bg-red-500 rounded-lg hover:bg-red-400'
						onClick={() => {
							if (selectedSubject) {
								deleteSubject(selectedSubject.id)
								setModal(false)
							}
						}}
					>
						Удалить
					</Button>
				</div>
			</div>
		</div>
	)
}
