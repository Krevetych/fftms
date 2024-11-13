import {
	IFilteredGroup,
	IGroup,
	IGroupCreate,
	IGroupD,
	IGroupUpdate
} from '@/types/group.types'

import { axiosWithAuth } from '@/api/interceptors'

class GroupService {
	private URL = '/group'

	async create(data: IGroupCreate) {
		const res = await axiosWithAuth.post<IGroup>(`${this.URL}/create`, data)

		return res.data
	}

	async upload(data: FormData) {
		const res = await axiosWithAuth.post<IGroup>(`${this.URL}/upload`, data)

		return res.data
	}

	async update(id: string, data: IGroupUpdate) {
		const res = await axiosWithAuth.patch<IGroup>(
			`${this.URL}/update?id=${id}`,
			data
		)

		return res.data
	}

	async getAll() {
		const res = await axiosWithAuth.get<IGroup[]>(`${this.URL}/find_all`)

		return res.data
	}

	async getAllD() {
		const res = await axiosWithAuth.get<IGroupD[]>(`${this.URL}/find_all_d`)

		return res.data
	}

	async getFiltered(data: IFilteredGroup | undefined) {
		const res = await axiosWithAuth.get<IGroup[]>(
			`${this.URL}/find_by_filters?type=${data?.type}&course=${data?.course}`
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

export const groupService = new GroupService()
