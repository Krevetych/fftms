import {
	IFilteredPlan,
	IFilters,
	IPlan,
	IPlanCreate,
	IPlanUpdate,
	IPlans
} from '@/types/plan.types'

import { axiosWithAuth } from '@/api/interceptors'

class PlanService {
	private URL = '/plan'

	async create(data: IPlanCreate) {
		const dto: IPlanCreate = {
			...data,
			maxHours: Number(data.maxHours),
			worked: 0
		}
		const res = await axiosWithAuth.post<IPlan>(`${this.URL}/create`, dto)

		return res.data
	}

	async update(id: string, data: IPlanUpdate) {
		const dto: IPlanUpdate = {
			...data,
			maxHours: Number(data.maxHours)
		}
		const res = await axiosWithAuth.patch<IPlan>(
			`${this.URL}/update?id=${id}`,
			dto
		)

		return res.data
	}

	async getFiltered(data: IFilters | undefined) {
		const res = await axiosWithAuth.get<IFilteredPlan[]>(
			`${this.URL}/find_by_filters?year=${data?.year}&teacher=${data?.teacher}&month=${data?.month}&monthHalf=${data?.monthHalf}&term=${data?.term}&rate=${data?.rate}`
		)

		return res.data
	}

	async getPlaned(data: IPlans | undefined) {
		const res = await axiosWithAuth.get<IFilteredPlan[]>(
			`${this.URL}/find_by_plan?year=${data?.year}&rate=${data?.rate}&status=${data?.status}&objectId=${data?.objectId}&teacherId=${data?.teacherId}&groupId=${data?.groupId}`
		)

		return res.data
	}

	async getAll() {
		const res = await axiosWithAuth.get<IPlan[]>(`${this.URL}/find_all`)

		return res.data
	}

	async getByid(id: string) {
		const res = await axiosWithAuth.get<IPlan>(
			`${this.URL}/find_by_id?id=${id}`
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

export const planService = new PlanService()
