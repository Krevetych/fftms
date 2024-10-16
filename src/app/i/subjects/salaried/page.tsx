import { Heading } from '@/components/Heading'

import { ERate } from '@/types/plan.types'

import { Subject } from '../Subject'

export default function SubjectsSalariedPage() {
	return (
		<>
			<Heading title='Вычитанные часы (тарификация)' />
			<Subject rate={ERate.SALARIED} />
		</>
	)
}
