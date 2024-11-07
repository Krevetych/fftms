'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { GroupTab } from '@/components/tabs/GroupTab'
import { ObjectTab } from '@/components/tabs/ObjectTab'
import { PlanTab } from '@/components/tabs/PlanTab'
import { TeacherTab } from '@/components/tabs/TeacherTab'

import { groupService } from '@/services/group.service'
import { objectService } from '@/services/object.service'
import { planService } from '@/services/plan.service'
import { teacherService } from '@/services/teacher.service'

export function Archive() {
	const [activeTab, setActiveTab] = useState(0)

	const { data: groupData, isLoading: groupLoading } = useQuery({
		queryKey: ['g-archive'],
		queryFn: () => groupService.getAllD()
	})

	const { data: objectData, isLoading: objectLoading } = useQuery({
		queryKey: ['o-archive'],
		queryFn: () => objectService.getAllD()
	})

	const { data: teacherData, isLoading: teacherLoading } = useQuery({
		queryKey: ['t-archive'],
		queryFn: () => teacherService.getAllD()
	})

	const { data: planData, isLoading: planLoading } = useQuery({
		queryKey: ['p-archive'],
		queryFn: () => planService.getAllD()
	})

	const tabs = [
		{
			id: 0,
			label: 'Группы',
			content: (
				<GroupTab
					data={groupData}
					isLoading={groupLoading}
				/>
			)
		},
		{
			id: 1,
			label: 'Предметы',
			content: (
				<ObjectTab
					data={objectData}
					isLoading={objectLoading}
				/>
			)
		},
		{
			id: 2,
			label: 'Преподаватели',
			content: (
				<TeacherTab
					data={teacherData}
					isLoading={teacherLoading}
				/>
			)
		},
		{
			id: 3,
			label: 'Планы',
			content: (
				<PlanTab
					data={planData}
					isLoading={planLoading}
				/>
			)
		}
	]

	return (
		<>
			<div className='my-3 h-0.5 bg-primary w-full' />

			<div className='w-full'>
				<div className='flex'>
					{tabs.map(tab => (
						<button
							key={tab.id}
							className={`px-4 py-1 text-lg font-semibold focus:outline-none ${
								activeTab === tab.id
									? 'border-b border-primary text-primary w-fit'
									: 'border-b border-transparent transition-colors text-gray-500 hover:text-gray-700'
							}`}
							onClick={() => setActiveTab(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div className='p-4'>{tabs[activeTab]?.content}</div>
			</div>
		</>
	)
}
