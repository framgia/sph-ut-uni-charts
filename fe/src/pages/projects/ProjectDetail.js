import { useEffect, useState } from 'react'
import { Container, Group, Table, Text, Title, Box } from '@mantine/core'

import styles from '@/styles/project-detail.module.css'
import { Chart, PageTitle } from './components'
import { developersList, velocityChartData } from '@/src/utils/dummyData'
import {
  ChartDataFormatter,
  VelocityDataFormatter,
  obtainData,
} from '@/src/utils/helpers'
import { getIssues, getActiveSprintData } from '@/src/api/providerApi'
import { useRouter } from 'next/router'

const ProjectDetail = () => {
  const router = useRouter()
  const [velocityResponse, setVelocityResponse] = useState()
  const [sprintData, setSprintData] = useState()
  const [velocityChartDataSet, setVelocityChartDataSet] = useState(
    ChartDataFormatter(velocityChartData)
  )
  const [velocityDataLabels, setVelocityDataLabels] = useState([])
  const [velocity, setVelocity] = useState(0)
  const [formattedSprint, setFormattedSprint] = useState()

  const query = router.query.id

  useEffect(() => {
    if (query) {
      const issues = getIssues(Number(router.query.id), 'backlog')
      setVelocityResponse(issues)
      const activeSprint = getActiveSprintData(
        Number(router.query.id),
        'backlog'
      )

      setSprintData(activeSprint)
    }
  }, [query])

  useEffect(() => {
    async function justToWait() {
      const velocityData = await VelocityDataFormatter(velocityResponse)
      const formattedSprintData = await obtainData(sprintData)

      setFormattedSprint(formattedSprintData)
      setVelocityDataLabels(velocityData.labels)
      setVelocityChartDataSet(ChartDataFormatter(velocityData.data))

      let tempVelocity = 0
      velocityData.data.completed.forEach((item) => {
        tempVelocity += item
      })

      tempVelocity = tempVelocity / velocityData.data.commitment?.length
      setVelocity(tempVelocity)
    }

    if (velocityResponse && sprintData) {
      justToWait()
    }
  }, [velocityResponse, sprintData])

  const burnDownChartDataSet = ChartDataFormatter(formattedSprint?.data)
  // const burnUpChartDataSet = ChartDataFormatter(burnUpChartData)

  return (
    <>
      <Box sx={{ width: '80%' }}>
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
            {/* Select component is for velocity chart */}
            {/* <Select
              label='Selected Sprint'
              placeholder='Select Sprint'
              data={formattedSprints}
              className={styles['burn-down-chart-select']}
              onChange={(e) => handleChange(e)}
            /> */}

            <Chart
              title='Burn Down Chart'
              labels={formattedSprint?.dates}
              datasets={burnDownChartDataSet}
              type='line'
            />
          </div>
        </Group>
        <Group position='center'>
          <div role='velocity-chart' className={styles['velocity-chart']}>
            <Text color='blue'>
              <Title order={5} className={styles['velocity-chart-velocity']}>
                Velocity: {velocity}
              </Title>
            </Text>
            <Chart
              title='Velocity Chart'
              labels={velocityDataLabels}
              datasets={velocityChartDataSet}
            />
          </div>
        </Group>

        <Container fluid>
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
      </Box>
    </>
  )
}

export default ProjectDetail
