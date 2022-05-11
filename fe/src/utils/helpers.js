import { chartColors } from './constants'

export const ChartDataFormatter = (data) => {
  const datasets = []
  let index = 0

  for (const key in data) {
    datasets.push({
      label: key,
      data: data[key],
      ...chartColors[index],
    })

    index++
  }

  return datasets
}

export const VelocityDataFormatter = async (rawData) => {
  const data = {
    commitment: [],
    completed: [],
  }
  const labels = []
  const tempData = await rawData

  tempData.reverse()
  tempData.forEach((item) => {
    let commitment = 0
    let completed = 0

    item.issues.forEach((issue) => {
      commitment += issue.estimatedHours
      if (issue.currentStatus === 'Closed') completed += issue.estimatedHours
    })

    // used unshift since the data is reversed e.g. sprint two comes first
    labels.unshift(item.milestone)
    data.commitment.unshift(commitment)
    data.completed.unshift(completed)
  })

  return { data, labels }
}

export const obtainData = async (rawData) => {
  const tempData = await rawData

  const { dates, data } = tempData

  return { dates, data }
}
