import { IGroup, IGroupCreate } from '@/types/group.types'

import { axiosWithAuth } from '@/api/interceptors'

class GroupService {
	private URL = '/group'

	async create(data: IGroupCreate) {
		console.log('Service: ', data)
		const res = await axiosWithAuth.post<IGroup>(`${this.URL}/create`, data)

		return res.data
	}

	async update(id: string, data: IGroupCreate) {
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

	async delete(id: string) {
		const res = await axiosWithAuth.delete<boolean>(
			`${this.URL}/delete?id=${id}`
		)

		return res.data
	}
}

export const groupService = new GroupService()
