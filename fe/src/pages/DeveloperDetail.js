import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  Container,
  Group,
  Image,
  Table,
  Text,
} from '@mantine/core'
import { ArrowBigLeft } from 'tabler-icons-react'

import styles from '@/styles/developer-detail.module.css'
import { developersList } from '@/src/utils/dummyData'

const DeveloperDetail = () => {
  const router = useRouter()

  const redirect = () => {
    const query = router.query

    if (query.project_id) {
      router.push(`/project-detail/${query.project_id}`)
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <Head>
        <title>Developer Detail</title>
      </Head>

      <Group className={styles['card-group']}>
        <div className={styles.back}>
          <div
            className={styles.innerBack}
            onClick={redirect}
            role='back-button'
          />
        </div>
        <Card shadow='lg' p='lg' className={styles.card}>
          <Group position='apart' className={styles['card-header']}>
            <Group direction='column' className={styles['name-and-position']}>
              <Text size='lg' className={styles.name} role='name'>
                Name: {developersList[0].name}
              </Text>
              <Text size='md' className={styles.position} role='position'>
                Position: {developersList[0].position}
              </Text>
            </Group>
            <Image src='/nakiri.jpeg' withPlaceholder width={80} height={80} />
          </Group>

          <Table striped>
            <tbody>
              <tr>
                <td>Individual Velocity</td>
                <td>12</td>
              </tr>
              <tr>
                <td>On time percentage</td>
                <td>91%</td>
              </tr>
              <tr>
                <td>Moved issue percentage</td>
                <td>94%</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Group>
    </>
  )
}

export default DeveloperDetail
