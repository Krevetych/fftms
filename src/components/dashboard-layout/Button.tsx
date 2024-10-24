interface IButtonProps {
	children: React.ReactNode
	type: 'submit' | 'reset' | 'button' | undefined
	onClick?: () => void
	extra: string
}

export function Button({ children, type, onClick, extra }: IButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={extra}
		>
			{children}
		</button>
	)
}
