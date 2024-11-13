import {
	ITeacher,
	ITeacherCreate,
	ITeacherD,
	ITeacherUpdate
} from '@/types/teacher.types'

import { axiosWithAuth } from '@/api/interceptors'

class TeacherService {
	private URL = '/teacher'

	async getAll() {
		const res = await axiosWithAuth.get<ITeacher[]>(`${this.URL}/find_all`)

		return res.data
	}

	async getAllD() {
		const res = await axiosWithAuth.get<ITeacherD[]>(`${this.URL}/find_all_d`)

		return res.data
	}

	async create(data: ITeacherCreate) {
		const res = await axiosWithAuth.post<ITeacher>(`${this.URL}/create`, data)

		return res.data
	}

	async upload(data: FormData) {
		const res = await axiosWithAuth.post<ITeacher>(`${this.URL}/upload`, data)

		return res.data
	}

	async update(id: string, data: ITeacherUpdate) {
		const res = await axiosWithAuth.patch<ITeacher>(
			`${this.URL}/update?id=${id}`,
			data
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

export const teacherService = new TeacherService()
