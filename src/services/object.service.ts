import { IObject, IObjectCreate } from '@/types/object.types'

import { axiosWithAuth } from '@/api/interceptors'

class ObjectService {
	private URL = '/object'

	async create(data: IObjectCreate) {
		const res = await axiosWithAuth.post<IObject>(`${this.URL}/create`, data)

		return res.data
	}

	async update(id: string, data: IObjectCreate) {
		const res = await axiosWithAuth.patch<IObject>(
			`${this.URL}/update?id=${id}`,
			data
		)

		return res.data
	}

	async getAll() {
		const res = await axiosWithAuth.get<IObject[]>(`${this.URL}/find_all`)

		return res.data
	}

	async delete(id: string) {
		const res = await axiosWithAuth.delete<boolean>(
			`${this.URL}/delete?id=${id}`
		)

		return res.data
	}
}

export const objectService = new ObjectService()
