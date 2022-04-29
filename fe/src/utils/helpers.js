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
