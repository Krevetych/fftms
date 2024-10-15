import { ERate } from '@/types/plan.types'
import { ISubject, ISubjectCreate, ISubjectUpdate } from '@/types/subject.types'

import { axiosWithAuth } from '@/api/interceptors'

class SubjectService {
	private URL = '/subject'

	async create(data: ISubjectCreate) {
		const dto: ISubjectCreate = { ...data, hours: Number(data.hours) }
		const res = await axiosWithAuth.post<ISubject>(`${this.URL}/create`, dto)

		return res.data
	}

	async update(id: string, data: ISubjectUpdate) {
		const res = await axiosWithAuth.patch<ISubject>(
			`${this.URL}/update?id=${id}`,
			data
		)

		return res.data
	}

	async getByRate(rate: ERate) {
		const res = await axiosWithAuth.get<ISubject[]>(
			`${this.URL}/find_by_rate?rate=${rate}`
		)

		return res.data
	}

	async delete(id: string) {
		const res = await axiosWithAuth.delete<boolean>(
			`${this.URL}/delete?id=${id}`
		)

		return res.data
	}
}

export const subjectService = new SubjectService()
