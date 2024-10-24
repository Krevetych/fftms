import { CSSProperties, ChangeEvent } from 'react'

interface IProps {
	placeholder: string
	value: string
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
	extra: string
	style: CSSProperties
}

export function SearchInput({
	placeholder,
	value,
	onChange,
	extra,
	style
}: IProps) {
	return (
		<input
			type='text'
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			className={extra}
			style={style}
		/>
	)
}
