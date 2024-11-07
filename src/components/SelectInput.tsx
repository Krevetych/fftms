import React, { forwardRef } from 'react'

interface SelectInputProps {
	label: string
	options: { value: string; label: string }[]
	loading?: boolean
	[x: string]: any
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
	({ label, options, loading = false, ...rest }, ref) => {
		// Функция для обрезки текста
		const truncateText = (text: string, maxLength: number) => {
			return text.length > maxLength
				? text.substring(0, maxLength) + '...'
				: text
		}

		return (
			<div className='mb-2'>
				<select
					ref={ref}
					{...rest}
					className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none min-w-0'
					disabled={loading || options.length === 0}
				>
					<option value=''>{loading ? 'Загрузка...' : label}</option>
					{options.map((option: { value: string; label: string }) => (
						<option
							key={option.value}
							value={option.value}
						>
							{truncateText(option.label, 15)}
						</option>
					))}
				</select>
			</div>
		)
	}
)

export default SelectInput
