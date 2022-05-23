import React from 'react'
import { Button } from '@mantine/core'

import style from './HomePageDeleteModal.module.css'
import DeleteModal from '../../molecules/DeleteModal'

const HomePageDeleteModal = ({
  deleteSingleProject,
  isOpen,
  selectedProject,
  setIsDeleteModalOpen,
}) => {
  const content = (
    <>
      <section>
        <h3>Are you sure you want to delete this project?</h3>
        <p>
          Project name: {selectedProject.name}
          <br />
          Provider: {selectedProject.provider?.name}
        </p>
      </section>

      <section className={style.buttonsSection}>
        <Button
          color='red'
          onClick={() => {
            deleteSingleProject(
              selectedProject.id,
              selectedProject.provider.name.toLowerCase()
            )
          }}
          role='confirm-delete'
        >
          Yes
        </Button>
        <Button
          onClick={() => {
            setIsDeleteModalOpen(false)
          }}
          role='cancel-delete'
        >
          No
        </Button>
      </section>
    </>
  )

  return (
    <DeleteModal
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      isOpen={isOpen}
      content={content}
    />
  )
}

export default HomePageDeleteModal
