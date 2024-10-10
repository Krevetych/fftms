import React from 'react'

interface TableProps {
	headers: string[]
	data: Array<Record<string, string | number>>
}

const CustomTable: React.FC<TableProps> = ({ headers, data }) => {
	return (
		<div className='overflow-x-auto'>
			{/* Заголовок с закругленными углами */}
			<div className='bg-gray-100 text-gray-500 rounded-t-lg shadow-md'>
				<div className='flex'>
					{headers.map((header, index) => (
						<div
							key={index}
							className='flex-1 px-6 py-3 text-xs font-medium uppercase tracking-wider text-left'
						>
							{header}
						</div>
					))}
				</div>
			</div>

			{/* Основная таблица, без верхнего отступа */}
			<table className='min-w-full bg-white text-gray-800 rounded-b-lg shadow-lg'>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
						>
							{Object.values(row).map((cell, cellIndex) => (
								<td
									key={cellIndex}
									className='px-6 py-4 text-sm text-gray-800'
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default CustomTable
