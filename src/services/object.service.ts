import {
	IObject,
	IObjectCreate,
	IObjectD,
	IObjectUpdate
} from '@/types/object.types'

import { axiosWithAuth } from '@/api/interceptors'

class ObjectService {
	private URL = '/object'

	async create(data: IObjectCreate) {
		const res = await axiosWithAuth.post<IObject>(`${this.URL}/create`, data)

		return res.data
	}

	async upload(data: FormData) {
		const res = await axiosWithAuth.post<IObject>(`${this.URL}/upload`, data)

		return res.data
	}

	async update(id: string, data: IObjectUpdate) {
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

	async getAllD() {
		const res = await axiosWithAuth.get<IObjectD[]>(`${this.URL}/find_all_d`)

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

export const objectService = new ObjectService()
