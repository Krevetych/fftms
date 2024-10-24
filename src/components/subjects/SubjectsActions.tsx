import { Dispatch, SetStateAction } from 'react'

import { SearchInput } from '../SearchInput'

interface IProps {
	searchTerm: string
	setSearchTerm: Dispatch<SetStateAction<string>>
}

export function SubjectsActions({ searchTerm, setSearchTerm }: IProps) {
	return (
		<div className='flex items-center justify-start'>
			<div className='flex gap-x-2 mb-4'>
				<SearchInput
					placeholder='Поиск по ФИО'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					extra='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-transparent border border-solid focus:border-primary text-ellipsis overflow-hidden whitespace-nowrap'
					style={{ maxWidth: '100%', overflow: 'hidden' }}
				/>
			</div>
		</div>
	)
}
