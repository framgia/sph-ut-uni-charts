import { Card, Container, Group, Text, Title } from '@mantine/core'

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
          <Group>
            {developersList.map((developer, index) => {
              return (
                <div style={{ width: '32%' }} key={index + developer.name}>
                  <Card shadow='lg' p='lg' role='card'>
                    <Card.Section />
                    <Card.Section>
                      <Text>Name: {developer.name}</Text>
                      <Text>Position: {developer.position}</Text>
                    </Card.Section>
                  </Card>
                </div>
              )
            })}
          </Group>
        </Container>
      </Container>
    </div>
  )
}

export default ProjectDetail
