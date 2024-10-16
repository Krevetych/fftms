import { Heading } from '@/components/Heading'

import { ERate } from '@/types/plan.types'

import { Subject } from '../Subject'

export default function SubjectsHourlyPage() {
	return (
		<>
			<Heading title='Вычитанные часы (почасая оплата)' />
			<Subject rate={ERate.HOURLY} />
		</>
	)
}
