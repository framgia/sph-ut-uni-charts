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

export const VelocityDataFormatter = (rawData) => {
  console.log(rawData)
  const data = {
    commitment: [],
    completed: [],
  }
  const labels = []

  if (!rawData) return { data, labels }

  rawData.reverse()
  rawData.forEach((item) => {
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
