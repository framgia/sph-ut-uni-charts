import { useState, Fragment } from 'react'
import { Button, Loader, Table } from '@mantine/core'
import Link from 'next/link'
import Router from 'next/router'

import { deleteProject } from '@/src/api/providerApi'
import HomePageDeleteModal from '../../organisms/HomePageDeleteModal'
import styles from '@/styles/index.module.css'

const TableList = ({ list = [], loading }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState({})

  const openDeleteModal = (project) => {
    setIsDeleteModalOpen(true)
    setSelectedProject(project)
  }

  const deleteSingleProject = async (id, provider) => {
    setIsDeleteModalOpen(false)
    await deleteProject(id, provider).then(() => {
      Router.push({
        pathname: '/',
        query: {
          ...Router.query,
          rel: new Date().getTime(),
        },
      })
    })
  }

  return (
    <Fragment>
      <Table striped>
        <thead className={styles['table-thead']}>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Project ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={!loading ? styles['fade-in'] : ''}>
          {loading && (
            <tr role='project-trow-loader'>
              <td colSpan='4' align='center'>
                <Loader />
              </td>
            </tr>
          )}

          {!loading &&
            list.map((project) => {
              return (
                <tr key={project.id} role='project-trow'>
                  <td>
                    <Link href={`/project-detail/${project.id}`}>
                      {project.name}
                    </Link>
                  </td>
                  <td>{project.provider.name}</td>
                  <td>{project.id}</td>
                  <td>
                    <Button
                      color='red'
                      onClick={() => openDeleteModal(project)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            })}

          {!loading && !list?.length && (
            <tr role='project-trow'>
              <td colSpan='4' align='center'>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <HomePageDeleteModal
        isOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        deleteSingleProject={deleteSingleProject}
        selectedProject={selectedProject}
      />
    </Fragment>
  )
}

export default TableList
