import { Plus, Upload } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

import { ITeacher } from '@/types/teacher.types'

import { SearchInput } from '../SearchInput'

interface IProps {
	handleModal: (
		type: 'create' | 'edit' | 'delete' | null,
		teacher?: ITeacher
	) => void
	handleImportModal: () => void
	searchTerm: string
	setSearchTerm: Dispatch<SetStateAction<string>>
}

export function TeachersActions({
	handleModal,
	handleImportModal,
	searchTerm,
	setSearchTerm
}: IProps) {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex gap-x-2'>
				<div
					className='flex items-center gap-2 p-3 bg-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary/80'
					onClick={() => handleModal('create')}
				>
					<Plus />
					<p>Создать</p>
				</div>
				<div
					className='flex items-center gap-2 p-3 border borde-solid border-primary w-fit rounded-lg transition-colors cursor-pointer hover:bg-primary'
					onClick={handleImportModal}
				>
					<Upload />
					<p>Импортировать</p>
				</div>
			</div>
			<div className='flex gap-x-2 mb-4'>
				<SearchInput
					placeholder='Поиск по ФИО'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					extra='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-transparent border border-solid focus:border-primary'
					style={{ maxWidth: '100%', overflow: 'hidden' }}
				/>
			</div>
		</div>
	)
}
