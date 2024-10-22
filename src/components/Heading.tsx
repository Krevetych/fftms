interface IHeading {
	title: string
}

export function Heading({ title }: IHeading) {
	return (
		<>
			<h1 className='text-3xl font-bold mt-5 mx-5'>{title}</h1>
		</>
	)
}
