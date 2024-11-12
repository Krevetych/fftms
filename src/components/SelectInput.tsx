import React, { forwardRef } from 'react'

interface SelectInputProps {
	label: string
	options: { value: string; label: string }[]
	loading?: boolean
	[x: string]: any
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
	({ label, options, loading = false, ...rest }, ref) => {
		return (
			<div className='mb-2'>
				<select
					ref={ref}
					{...rest}
					className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-transparent border border-solid cursor-pointer appearance-none focus:border-primary focus:border focus:border-solid'
					disabled={loading || options.length === 0}
				>
					<option value=''>{loading ? 'Загрузка...' : label}</option>
					{options.map((option: { value: string; label: string }) => (
						<option
							key={option.value}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</select>
			</div>
		)
	}
)

export default SelectInput
