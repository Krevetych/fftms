'use client'

import { useState } from 'react'

import Loader from '@/components/Loader'
import NotFoundData from '@/components/NotFoundData'
import { ObjectsActions } from '@/components/objects/ObjectsActions'
import { ObjectsCreateModal } from '@/components/objects/ObjectsCreateModal'
import { ObjectsImportModal } from '@/components/objects/ObjectsImportModal'
import { ObjectsTable } from '@/components/objects/ObjectsTable'

import { IObject } from '@/types/object.types'

import { useCreateObject } from '@/hooks/objects/useCreateObject'
import { useDeleteObject } from '@/hooks/objects/useDeleteObject'
import { useGetObjects } from '@/hooks/objects/useGetObjects'
import { useImportObject } from '@/hooks/objects/useImportObject'

export function Object() {
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data, isLoading } = useGetObjects()
	const {
		handleModal,
		handleSubmit,
		onSubmit,
		actionType,
		setModal,
		modal,
		register,
		selectedObject
	} = useCreateObject()
	const {
		handleImportModal,
		importModal,
		handleFileChange,
		isPending,
		setImportModal
	} = useImportObject()
	const { deleteObject } = useDeleteObject()

	const filteredObject = data?.filter((object: IObject) =>
		object.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<>
			<div className='my-3 h-0.5 bg-primary w-full' />
			<ObjectsActions
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				handleModal={handleModal}
				handleImportModal={handleImportModal}
			/>

			{modal && (
				<ObjectsCreateModal
					actionType={actionType}
					setModal={setModal}
					deleteObject={deleteObject}
					handleSubmit={handleSubmit}
					onSubmit={onSubmit}
					register={register}
					selectedObject={selectedObject}
				/>
			)}

			{importModal && (
				<ObjectsImportModal
					handleFileChange={handleFileChange}
					setImportModal={setImportModal}
					isPending={isPending}
				/>
			)}

			{isLoading ? (
				<Loader />
			) : filteredObject?.length !== 0 && filteredObject ? (
				<div className='overflow-x-auto'>
					<div className='overflow-y-auto max-h-[75vh]'>
						<ObjectsTable
							handleModal={handleModal}
							filteredObject={filteredObject}
						/>
					</div>
				</div>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
