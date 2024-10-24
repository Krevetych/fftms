import { X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

import Input from '../Input'
import Loader from '../Loader'

interface IProps {
	setImportModal: Dispatch<SetStateAction<boolean>>
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	isPending: boolean
}

export function TeachersImportModal({
	setImportModal,
	handleFileChange,
	isPending
}: IProps) {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-bg p-4 rounded-lg shadow-lg'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-black'>Импорт данных</h1>
					<X
						size={24}
						onClick={() => setImportModal(false)}
						className='rounded-full transition-colors cursor-pointer hover:bg-primary'
					/>
				</div>
				<div className='flex flex-col gap-4 mt-4'>
					<Input
						type='file'
						accept='.xlsx,.xls'
						onChange={handleFileChange}
						placeholder='Выберите файл'
					/>
					{isPending && <Loader />}
				</div>
			</div>
		</div>
	)
}
