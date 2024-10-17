import { ERate } from '@/types/plan.types'
import {
	IFilteredSubject,
	IFilteredSubjectTerm,
	ISubject,
	ISubjectCreate,
	ISubjectTerm,
	ISubjectTermCreate,
	ISubjectTermUpdate,
	ISubjectUpdate
} from '@/types/subject.types'

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
		if (rate === ERate.HOURLY) {
			const res = await axiosWithAuth.get<ISubject[]>(
				`${this.URL}/find_by_rate?rate=${rate}`
			)

			return res.data
		} else {
			const res = await axiosWithAuth.get<ISubjectTerm[]>(
				`${this.URL}/find_by_rate_term?rate=${rate}`
			)

			return res.data
		}
	}

	async getFiltered(data: IFilteredSubject | undefined) {
		const res = await axiosWithAuth.get<ISubject[]>(
			`${this.URL}/find_by_filters?month=${data?.month}&monthHalf=${data?.monthHalf}&type=${data?.type}&teacherId=${data?.teacherId}&groupId=${data?.groupId}`
		)

		return res.data
	}

	async getFilteredTerm(data: IFilteredSubjectTerm | undefined) {
		const res = await axiosWithAuth.get<ISubjectTerm[]>(
			`${this.URL}/find_by_filters_term?term=${data?.term}&type=${data?.type}&teacherId=${data?.teacherId}&groupId=${data?.groupId}`
		)

		return res.data
	}

	async delete(id: string, rate: ERate) {
		if (rate === ERate.HOURLY) {
			const res = await axiosWithAuth.delete<boolean>(
				`${this.URL}/delete?id=${id}`
			)
			return res.data
		} else {
			const res = await axiosWithAuth.delete<boolean>(
				`${this.URL}/delete_term?id=${id}`
			)
			return res.data
		}
	}

	async createTerm(data: ISubjectTermCreate) {
		const dto: ISubjectTermCreate = { ...data, hours: Number(data.hours) }
		const res = await axiosWithAuth.post<ISubjectTerm>(
			`${this.URL}/create_term`,
			dto
		)

		return res.data
	}

	async updateTerm(id: string, data: ISubjectTermUpdate) {
		const res = await axiosWithAuth.patch<ISubjectTerm>(
			`${this.URL}/update_term?id=${id}`,
			data
		)

		return res.data
	}

	async deleteTerm(id: string) {
		const res = await axiosWithAuth.delete<boolean>(
			`${this.URL}/delete_term?id=${id}`
		)

		return res.data
	}
}

export const subjectService = new SubjectService()
