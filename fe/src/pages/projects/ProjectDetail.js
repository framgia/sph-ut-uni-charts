import { useEffect, useState } from 'react'
import {
  Button,
  Container,
  Group,
  Select,
  Table,
  Text,
  Title,
} from '@mantine/core'

import styles from '@/styles/project-detail.module.css'
import { Chart, PageTitle } from './components'
import {
  burnDownChartData,
  burnUpChartData,
  developersList,
  sprintLabels,
  sprintSelectFields,
  velocityChartData,
  aaa,
} from '@/src/utils/dummyData'
import { ChartDataFormatter, VelocityDataFormatter } from '@/src/utils/helpers'
import { getIssues } from '@/src/services/bffService'
import { useRouter } from 'next/router'

const ProjectDetail = () => {
  const router = useRouter()
  const [velocityResponse, setVelocityResponse] = useState()
  const [velocityChartDataSet, setVelocityChartDataSet] = useState(
    ChartDataFormatter(velocityChartData)
  )
  const [velocityDataLabels, setVelocityDataLabels] = useState([])

  const query = router.query.id

  useEffect(() => {
    if (query) {
      const issues = getIssues(Number(router.query.id), 'backlog')
      setVelocityResponse(issues)
    }
  }, [query])

  useEffect(() => {
    async function justToWait() {
      const velocityData = await VelocityDataFormatter(velocityResponse)

      setVelocityDataLabels(velocityData.labels)
      setVelocityChartDataSet(ChartDataFormatter(velocityData.data))
    }

    if (velocityResponse) {
      justToWait()
    }
  }, [velocityResponse])

  const burnDownChartDataSet = ChartDataFormatter(burnDownChartData)
  const burnUpChartDataSet = ChartDataFormatter(burnUpChartData)

  return (
    <div>
      <Container fluid color='blue'>
        <PageTitle pageTitle='Project Name Detail' />
        <Button component='a' href='/'>
          {'< Back to home'}
        </Button>
        <Group position='center'>
          {/* <div role='burn-up-chart' className={styles['burn-up-chart']}>
            <Chart
              title='Burn Up Chart'
              labels={sprintLabels}
              datasets={burnUpChartDataSet}
              type='line'
            />
          </div> */}
          <div role='burn-down-chart' className={styles['brn-down-chart']}>
            <Select
              label='Selected Sprint'
              placeholder='Select Sprint'
              data={sprintSelectFields}
              className={styles['burn-down-chart-select']}
            />
            <Chart
              title='Burn Down Chart'
              labels={sprintLabels}
              datasets={burnDownChartDataSet}
              type='line'
            />
          </div>
        </Group>
        <Group position='center'>
          <div role='velocity-chart' className={styles['velocity-chart']}>
            <Text color='blue'>
              <Title order={5} className={styles['velocity-chart-velocity']}>
                Velocity: {3}
              </Title>
            </Text>
            <Chart
              title='Velocity Chart'
              labels={velocityDataLabels}
              datasets={velocityChartDataSet}
            />
          </div>
        </Group>

        <Container py='lg'>
          <Text color='blue'>
            <Title order={4}>Developers</Title>
          </Text>
          <Table striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {developersList.map((developer) => {
                return (
                  <tr key={`${developer.name}_${developer.position}`}>
                    <td>{developer.name}</td>
                    <td>{developer.position}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Container>
      </Container>
    </div>
  )
}

export default ProjectDetail
