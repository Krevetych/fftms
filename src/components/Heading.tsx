interface IHeading {
	title: string
}

export function Heading({ title }: IHeading) {
	return (
		<>
			<h1 className='text-3xl font-bold mx-5'>{title}</h1>

			<div className='my-3 h-0.5 bg-slate-400/50 w-full' />
		</>
	)
}
