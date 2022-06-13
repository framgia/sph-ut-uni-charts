import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Card, Group, Image, Table, Text } from '@mantine/core'

import styles from '@/styles/developer-detail.module.css'
import { getDeveloperIcon, getDeveloperInfo } from '@/src/api/providerApi'
import Loader from '@/src/components/molecules/Loader'

const DeveloperDetail = () => {
  const router = useRouter()
  const query = router.query
  const [imgSrc, setImgSrc] = useState('/nakiri.jpeg')
  const [devInfo, setDevInfo] = useState({})
  const [apiFetched, setApiFetched] = useState(false)

  useEffect(() => {
    if (query.id && !apiFetched) {
      getDeveloperIcon(query.project_id, 'backlog', query.id).then(
        (response) => {
          setImgSrc(response.data)
        }
      )

      getDeveloperInfo(query.project_id, 'backlog', query.id)
        .then((response) => {
          setDevInfo(response.data)
        })
        .catch(() => {
          setDevInfo({
            name: 'error',
            velocity: 0,
            closedOnTimePercentage: 0,
            movedIssuePercentage: 0,
          })
        })

      setApiFetched(true)
    }
  }, [query])

  const redirect = () => {
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
                Name:{' '}
                {devInfo.name ? (
                  devInfo.name
                ) : (
                  <Loader
                    className={styles['name-loader']}
                    height={20}
                    top={7}
                  />
                )}
              </Text>
              <Text size='md' className={styles.position} role='position'>
                Position: Dev...
              </Text>
            </Group>
            <Image src={imgSrc} width={80} height={80} />
          </Group>

          {devInfo.name ? (
            <Table striped>
              <tbody>
                <tr>
                  <td>Individual Velocity</td>
                  <td>{devInfo.velocity}</td>
                </tr>
                <tr>
                  <td>On time percentage</td>
                  <td>{devInfo.closedOnTimePercentage}%</td>
                </tr>
                <tr>
                  <td>Moved issue percentage</td>
                  <td>{devInfo.movedIssuePercentage}%</td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <Loader />
          )}
        </Card>
      </Group>
    </>
  )
}

export default DeveloperDetail
