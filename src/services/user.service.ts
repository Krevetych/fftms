import { IUser, IUserCreate, IUserPassword } from '@/types/auth.types'

import { axiosWithAuth } from '@/api/interceptors'

class UserService {
	private URL = '/user'

	async getById() {
		const res = await axiosWithAuth.get<IUser>(`${this.URL}/find_by_id`)

		return res.data
	}

	async update(id: string, data: IUserCreate) {
		const res = await axiosWithAuth.patch<IUser>(
			`${this.URL}/update?id=${id}`,
			data
		)

		return res.data
	}

	async updatePassword(data: IUserPassword) {
		const res = await axiosWithAuth.put<IUser>(
			`${this.URL}/update_password`,
			data
		)
		console.log(data)
		return res.data
	}

	async delete(id: string) {
		const res = await axiosWithAuth.delete<boolean>(
			`${this.URL}/delete?id=${id}`
		)

		return res.data
	}
}

export const userService = new UserService()
