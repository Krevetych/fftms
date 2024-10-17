export function Profile({ login }: { login: string | undefined }) {
	return (
		<div className='flex items-center gap-x-4'>
			<div className='w-10 h-10 rounded-full font-semibold flex items-center justify-center border border-primary border-solid'>
				{login?.charAt(0).toUpperCase()}
			</div>
			<p className='text-xl font-semibold capitalize'>{login}</p>
		</div>
	)
}
