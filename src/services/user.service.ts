import { IUser } from '@/types/auth.types'

import { axiosWithAuth } from '@/api/interceptors'

class UserService {
	private URL = '/user'

	async getUser() {
		const res = await axiosWithAuth.get<IUser>(`${this.URL}/find_by_id`)

		return res.data
	}
}

export const userService = new UserService()
