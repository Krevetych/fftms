import { IUpdateUser, IUser } from '@/types/auth.types'

import { axiosWithAuth } from '@/api/interceptors'

class UserService {
	private URL = '/user'

	async getById() {
		const res = await axiosWithAuth.get<IUser>(`${this.URL}/find_by_id`)

		return res.data
	}

	async getAll() {
		const res = await axiosWithAuth.get<IUser[]>(`${this.URL}/find_all`)

		return res.data
	}

	async update(id: string, data: IUpdateUser) {
		const res = await axiosWithAuth.patch<IUser>(
			`${this.URL}/update?id=${id}`,
			data
		)

		return res.data
	}

	async delete(id: string) {
		const res = await axiosWithAuth.delete<IUser>(`${this.URL}/delete?id=${id}`)

		return res.data
	}
}

export const userService = new UserService()
