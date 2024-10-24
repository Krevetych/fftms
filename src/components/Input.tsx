import React, { Ref, forwardRef } from 'react'

interface IInputProps {
	type: string
	placeholder: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	accept?: string
	defaultValue?: string
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
	({ type, placeholder, onChange, accept, defaultValue, ...rest }, ref) => {
		return (
			<input
				type={type}
				className='p-3 rounded-lg text-text bg-card font-semibold placeholder:text-text placeholder:font-normal w-full outline-none border-none'
				onChange={onChange}
				placeholder={placeholder}
				accept={accept}
				defaultValue={defaultValue}
				ref={ref}
				{...rest}
			/>
		)
	}
)

Input.displayName = 'Input'

export default Input
