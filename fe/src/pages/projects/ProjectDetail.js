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
import {
  ChartDataFormatter,
  VelocityDataFormatter,
  sprintDataFormat,
  getDates,
  formatSprintDates,
} from '@/src/utils/helpers'
import {
  getIssues,
  getIssuesRelatedToSprint,
  getSprints,
} from '@/src/services/bffService'
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
  const [formattedSprints, setFormattedSprint] = useState([])
  const [issuesData, setIssuesData] = useState([])
  const [burndownChartLabel, setburndownChartLabel] = useState([])

  // console.log(sprints)

  const query = router.query.id

  useEffect(() => {
    if (query) {
      const issues = getIssues(Number(router.query.id), 'backlog')
      setVelocityResponse(issues)
      const sprints = getSprints(Number(router.query.id), 'backlog')
      setSprintData(sprints)
    }
  }, [query])

  useEffect(() => {
    async function justToWait() {
      const velocityData = await VelocityDataFormatter(velocityResponse)
      const formattedSprintData = await sprintDataFormat(sprintData)
      // const getSprintDates = await getDates(sprintData)
      console.log(formattedSprintData)

      setFormattedSprint(formattedSprintData)
      setVelocityDataLabels(velocityData.labels)
      // setburndownChartLabel(formattedSprintData.labels)
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

  const burnDownChartDataSet = ChartDataFormatter(issuesData.ETData)
  // const burnUpChartDataSet = ChartDataFormatter(burnUpChartData)

  const handleChange = async (milestoneId) => {
    const relatedIssues = await getIssuesRelatedToSprint(
      Number(router.query.id),
      milestoneId,
      'backlog'
    )

    // console.log(relatedIssues)
    const getDates = formatSprintDates(relatedIssues.issuesData, milestoneId)
    setIssuesData(relatedIssues)
  }

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
              data={formattedSprints}
              className={styles['burn-down-chart-select']}
              // onChange={(e) => console.log(formattedSprints[0])}
              onChange={(e) => handleChange(e)}
              // value={}
            />

            <Chart
              title='Burn Down Chart'
              labels={formattedSprints}
              // labels={formattedSprints.datesList}
              // TODO: display issues
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
