import {
	IFilteredPlan,
	IFilters,
	IPlan,
	IPlanCreate,
	IPlanUpdate
} from '@/types/plan.types'

import { axiosWithAuth } from '@/api/interceptors'

class PlanService {
	private URL = '/plan'

	async create(data: IPlanCreate) {
		const dto: IPlanCreate = { ...data, maxHours: Number(data.maxHours) }
		const res = await axiosWithAuth.post<IPlan>(`${this.URL}/create`, dto)

		return res.data
	}

	async update(id: string, data: IPlanUpdate) {
		const res = await axiosWithAuth.patch<IPlan>(
			`${this.URL}/update?id=${id}`,
			data
		)

		return res.data
	}

	async getFiltered(data: IFilters | undefined) {
		const res = await axiosWithAuth.get<IFilteredPlan[]>(
			`${this.URL}/find_by_filters?year=${data?.year}&teacher=${data?.teacher}&month=${data?.month}&monthHalf=${data?.monthHalf}`
		)

		return res.data
	}

	async getAll() {
		const res = await axiosWithAuth.get<IPlan[]>(`${this.URL}/find_all`)

		return res.data
	}

	async delete(id: string) {
		const res = await axiosWithAuth.delete<boolean>(
			`${this.URL}/delete?id=${id}`
		)

		return res.data
	}
}

export const planService = new PlanService()
