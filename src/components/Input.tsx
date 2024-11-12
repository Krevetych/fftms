import { Eye, EyeClosed, EyeOff } from 'lucide-react'
import React, { forwardRef } from 'react'

interface IInputProps {
	type: string
	placeholder: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	accept?: string
	defaultValue?: string
	togglePassword?: () => void
	extra?: string
	passwordVisible?: boolean
	value?: string
	readOnly?: boolean
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
	(
		{
			type,
			placeholder,
			onChange,
			accept,
			defaultValue,
			togglePassword,
			passwordVisible,
			extra,
			value,
			readOnly,
			...rest
		},
		ref
	) => {
		return (
			<div className={extra}>
				<input
					type={type}
					className={`p-3 rounded-lg  mb-2 bg-card font-semibold ${readOnly ? 'text-text/50 placeholder:text-text/50' : 'text-text placeholder:text-text'} placeholder:font-normal w-full outline-none border-none`}
					onChange={onChange}
					placeholder={placeholder}
					accept={accept}
					defaultValue={defaultValue}
					value={value}
					readOnly={readOnly}
					autoFocus
					ref={ref}
					{...rest}
				/>
				{togglePassword && (
					<span
						onClick={togglePassword}
						style={{
							position: 'absolute',
							right: '10px',
							top: '50%',
							transform: 'translateY(-50%)',
							cursor: 'pointer'
						}}
					>
						{passwordVisible ? <Eye size={20} /> : <EyeClosed size={20} />}
					</span>
				)}
			</div>
		)
	}
)

Input.displayName = 'Input'

export default Input
