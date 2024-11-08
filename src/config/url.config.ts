class DASHBOARD {
	private root = '/i'
	private auth = '/auth'

	HOME = this.root
	REGISTER = `${this.auth}/register`
	LOGIN = `${this.auth}/login`
	GROUPS = `${this.root}/groups`
	OBJECTS = `${this.root}/objects`
	PLANS = `${this.root}/plans`
	SUBJECTS_H = `${this.root}/subjects/hourly`
	SUBJECTS_T = `${this.root}/subjects/salaried`
	TEACHERS = `${this.root}/teachers`
	ARCHIVE = `${this.root}/archive`
	DOCS = `${this.root}/docs`
}

export const PAGES = new DASHBOARD()
