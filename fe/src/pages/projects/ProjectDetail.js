import { Card, Container, Group, Table, Text, Title } from '@mantine/core'

import { Chart, PageTitle } from './components'
import {
  burnDownChartData,
  burnUpChartData,
  developersList,
  sprintLabels,
  velocityChartData,
} from '@/src/utils/dummyData'
import { ChartDataFormatter } from '@/src/utils/helpers'

const ProjectDetail = () => {
  const velocityChartDataSet = ChartDataFormatter(velocityChartData)
  const burnDownChartDataSet = ChartDataFormatter(burnDownChartData)
  const burnUpChartDataSet = ChartDataFormatter(burnUpChartData)

  return (
    <div>
      <Container fluid color='blue'>
        <PageTitle pageTitle='Project Name Detail' />
        <Group grow>
          <div role='burn-up-chart'>
            <Chart
              title='Burn Up Chart'
              labels={sprintLabels}
              datasets={burnUpChartDataSet}
              type='line'
            />
          </div>
          <div role='burn-down-chart'>
            <Chart
              title='Burn Down Chart'
              labels={sprintLabels}
              datasets={burnDownChartDataSet}
              type='line'
            />
          </div>
        </Group>
        <Group position='center'>
          <div role='velocity-chart' style={{ width: '50%' }}>
            <Chart
              title='Velocity Chart'
              labels={sprintLabels}
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
