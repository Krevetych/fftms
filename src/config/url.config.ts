class DASHBOARD {
	private root = '/i'
	private auth = '/auth'

	HOME = this.root
	REGISTER = `${this.auth}/register`
	LOGIN = `${this.auth}/login`
	GROUPS = `${this.root}/groups`
	OBJECTS = `${this.root}/objects`
	PLANS = `${this.root}/plans`
	SUBJECTS = `${this.root}/subjects`
	TEACHERS = `${this.root}/teachers`
}

export const PAGES = new DASHBOARD()
