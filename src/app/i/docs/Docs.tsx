import Link from 'next/link'

import { PAGES } from '@/config/url.config'

export function Docs() {
	return (
		<>
			<div className='my-3 h-0.5 bg-primary w-full' />
			<div className='text-lg mx-5 my-10 flex flex-col gap-y-10 overflow-y-auto'>
				<div className='flex flex-col gap-y-3'>
					<h1 className='text-3xl font-bold'>Основные функции сайта</h1>
					<p className='mx-5'>
						Данный сайт предназначен для{' '}
						<span className='text-primary'>
							учета отработанных часов преподавателя
						</span>
						, учитывая тип тарификации и период (месяц/семестр).
					</p>
					<h2 className='text-xl font-semibold mx-5'>
						Основные возможности администратора (Завуч):
					</h2>
					<div className='mx-12 flex flex-col gap-y-2'>
						<li>
							Создание, редактирование и удаление{' '}
							<Link
								href={PAGES.TEACHERS}
								className='text-primary transition-colors underline hover:text-primary/80'
							>
								преподавателей.
							</Link>
						</li>
						<li>
							Создание, редактирование и удаление учебных{' '}
							<Link
								href={PAGES.OBJECTS}
								className='text-primary transition-colors underline hover:text-primary/80'
							>
								предметов.
							</Link>
						</li>
						<li>
							Создание, редактирование и удаление учебных{' '}
							<Link
								href={PAGES.GROUPS}
								className='text-primary transition-colors underline hover:text-primary/80'
							>
								групп.
							</Link>
						</li>
						<li>
							Создание, редактирование и удаление учебных{' '}
							<Link
								href={PAGES.PLANS}
								className='text-primary transition-colors underline hover:text-primary/80'
							>
								планов.
							</Link>
						</li>
						<li>
							Создание, редактирование и удаление{' '}
							<Link
								href={PAGES.HOME}
								className='text-primary transition-colors underline hover:text-primary/80'
							>
								вычитанных часов.
							</Link>
						</li>
						<li>Экспорт данных из табличного документа Excel.</li>
						<li>Импорт данных в табличного документа Excel.</li>
					</div>
					<h2 className='text-xl font-semibold mx-5'>
						Основные возможности пользователя (Бухгалтерия):
					</h2>
					<div className='mx-12 flex flex-col gap-y-2'>
						<li>Просмотр вычитанных часов.</li>
						<li>Импорт данных в табличного документа Excel.</li>
					</div>
					<p>
						Так же имеется возможность смены пароля по клику на значок профиля в
						левом верхнем углу.
					</p>
				</div>
				<div className='flex flex-col gap-y-3'>
					<h1 className='text-3xl font-bold'>
						Необходимые данные для правильного экспорта
					</h1>
					<div>
						<p className='text-base'>
							Примечание: регистр заголовков{' '}
							<span className='font-semibold text-primary'>важен.</span>
						</p>
						<p className='text-base'>
							В скобочках указываются варианты данных из перечисления. Без
							полного совпадения будут ошибки.
						</p>
					</div>
					<h2 className='text-xl font-semibold mx-5'>
						Экспорт преподавателей:
					</h2>
					<div className='mx-12 flex flex-col gap-y-2'>
						<li>фио</li>
					</div>
					<h2 className='text-xl font-semibold mx-5'>Экспорт предметов:</h2>
					<div className='mx-12 flex flex-col gap-y-2'>
						<li>название</li>
					</div>
					<h2 className='text-xl font-semibold mx-5'>Экспорт групп:</h2>
					<div className='mx-12 flex flex-col gap-y-2'>
						<li>название</li>
						<li>тип (Бюджет, Внебюджет, НПО)</li>
						<li>курс (1, 2, 3, 4, -)</li>
					</div>
					<h2 className='text-xl font-semibold mx-5'>Экспорт планов:</h2>
					<div className='mx-12 flex flex-col gap-y-2'>
						<li>предмет</li>
						<li>преподаватель</li>
						<li>группа</li>
						<li>тариф (Тарифицированная, Почасовая)</li>
						<li>макс. часы</li>
					</div>
				</div>
				<div className='flex flex-col gap-y-3'>
					<h1 className='text-3xl font-bold'>
						Необходимые данные для правильного импорта
					</h1>
					<div className='mx-12 flex flex-col gap-y-2'>
						<li>год</li>
						<li>тариф (Тарифицированная, Почасовая)</li>
					</div>
				</div>
			</div>
		</>
	)
}
