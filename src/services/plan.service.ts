import { MONTH, MONTH_HALF, RATE, TERM } from '@/constants/table.constants'

import {
	ERate,
	IFilteredPlan,
	IFilters,
	IPlan,
	IPlanCreate,
	IPlanD,
	IPlanUpdate,
	IPlans,
	IUnloadPlans
} from '@/types/plan.types'
import { EMonth, EMonthHalf, ETerm } from '@/types/subject.types'

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

	async upload(data: FormData) {
		const res = await axiosWithAuth.post<IPlan>(`${this.URL}/upload`, data)

		return res.data
	}

	async unload(dto: IUnloadPlans | undefined) {
		const res = await axiosWithAuth.get(
			`${this.URL}/unload?year=${dto?.year}&rate=${dto?.rate}&term=${dto?.term}&month=${dto?.month}&monthHalf=${dto?.monthHalf}`,
			{ responseType: 'blob' }
		)

		const blob = new Blob([res.data])

		const url = window.URL.createObjectURL(blob)

		const era =
			dto?.rate === ERate.HOURLY
				? `${MONTH[dto?.month as EMonth]}-${MONTH_HALF[dto?.monthHalf as EMonthHalf]} половина`
				: `${TERM[dto?.term as ETerm]} семестр`

		const a = document.createElement('a')
		a.href = url
		a.download = `${dto?.year}-${RATE[dto?.rate as ERate]}-${era}.xlsx`
		document.body.appendChild(a)
		a.click()
		a.remove()
		window.URL.revokeObjectURL(url)

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
			`${this.URL}/find_by_filters?year=${data?.year}&month=${data?.month}&monthHalf=${data?.monthHalf}&term=${data?.term}&rate=${data?.rate}`
		)

		return res.data
	}

	async getPlaned(data: IPlans | undefined) {
		const res = await axiosWithAuth.get<IFilteredPlan[]>(
			`${this.URL}/find_by_plan?year=${data?.year}&rate=${data?.rate}&objectId=${data?.objectId}&teacherId=${data?.teacherId}&groupId=${data?.groupId}`
		)

		return res.data
	}

	async getAll() {
		const res = await axiosWithAuth.get<IPlan[]>(`${this.URL}/find_all`)

		return res.data
	}

	async getAllD() {
		const res = await axiosWithAuth.get<IPlanD[]>(`${this.URL}/find_all_d`)

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

	async forceDelete(id: string) {
		const res = await axiosWithAuth.delete<boolean>(
			`${this.URL}/force_delete?id=${id}`
		)

		return res.data
	}

	async restore(id: string) {
		const res = await axiosWithAuth.put<boolean>(`${this.URL}/restore?id=${id}`)

		return res.data
	}
}

export const planService = new PlanService()
