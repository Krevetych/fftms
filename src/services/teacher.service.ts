import { ITeacher, ITeacherForm } from '@/types/teacher.types'

import { axiosWithAuth } from '@/api/interceptors'

class TeacherService {
	private URL = '/teacher'

	async getAll() {
		const res = await axiosWithAuth.get<ITeacher[]>(`${this.URL}/find_all`)

		return res.data
	}

	async create(data: ITeacherForm) {
		const res = await axiosWithAuth.post<ITeacher>(`${this.URL}/create`, data)

		return res.data
	}
}

export const teacherService = new TeacherService()
