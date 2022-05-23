import React from 'react'
import { Modal } from '@mantine/core'

const DeleteModal = ({ content, isOpen, setIsDeleteModalOpen }) => {
  return (
    <Modal
      centered
      onClose={() => {
        setIsDeleteModalOpen(false)
      }}
      opened={isOpen}
      role='delete-modal'
      withCloseButton={false}
    >
      {content}
    </Modal>
  )
}

export default DeleteModal
