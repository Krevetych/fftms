import {
	BookUser,
	Captions,
	Hourglass,
	LayoutDashboard,
	LibraryBig,
	NotebookText,
	School
} from 'lucide-react'

import { PAGES } from '@/config/url.config'

import { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	{
		icon: LayoutDashboard,
		name: 'Главная',
		link: PAGES.HOME
	},
	{
		icon: NotebookText,
		name: 'Учебные планы',
		link: PAGES.PLANS
	},
	{
		icon: Hourglass,
		name: 'Вычитанные часы (Час)',
		link: PAGES.SUBJECTS_H
	},
	{
		icon: Captions,
		name: 'Вычитанные часы (Тариф)',
		link: PAGES.SUBJECTS_T
	},
	{
		icon: BookUser,
		name: 'Группы',
		link: PAGES.GROUPS
	},
	{
		icon: LibraryBig,
		name: 'Предметы',
		link: PAGES.OBJECTS
	},
	{
		icon: School,
		name: 'Преподаватели',
		link: PAGES.TEACHERS
	}
]
