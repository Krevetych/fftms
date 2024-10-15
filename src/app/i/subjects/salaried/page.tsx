import { Heading } from '@/components/Heading'

import { ERate } from '@/types/plan.types'

import { Subject } from '../Subject'

export default function SubjectsSalariedPage() {
	return (
		<>
			<Heading title='Вычитанные часы (тарифицированный тариф)' />
			<Subject rate={ERate.SALARIED} />
		</>
	)
}
