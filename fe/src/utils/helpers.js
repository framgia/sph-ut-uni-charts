import { chartColors } from './constants'

export const ChartDataFormatter = (data) => {
  // console.log(data)
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

  // console.log(datasets)

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

// export const getDates = (start, end) => {
//   const dates = []

//   for (
//     var arr = [], dt = new Date(start);
//     dt <= new Date(end);
//     dt.setDate(dt.getDate() + 1)
//   ) {
//     arr.push(new Date(dt).toLocaleDateString())
//   }

//   return arr
// }

export const sprintDataFormat = async (data) => {
  // const formattedData = {
  //   labels: [],
  //   sprints: [],
  // }

  // let datesList
  const sprintList = []
  const tempData = await data

  tempData.reverse()

  tempData?.forEach((it) => {
    // console.log(it)
    // TODO: GET list of dates btween startDate and endDate for x-axis data in chart
    // const startDate = new Date(it.startDate)
    // const endDate = new Date(it.releaseDueDate)
    // const dates = getDates(startDate, endDate)

    sprintList.push({
      label: it.name,
      value: it.id,
    })
    return sprintList
  })
  //   formattedData.sprints.unshift({
  //     label: it.name,
  //     value: it.id,
  //   })
  //   formattedData.labels.unshift(dates)
  //   // datesList = dates
  // })

  // console.log(formattedData)

  // return { sprintList, datesList }

  // return formattedData
}

// export const formatSprintDates = (issues, milestone) => {
//   // console.log(issues)
//   // console.log(milestone)
//   const sprints = []
//   issues.map((issue) => {
//     const milestones = issue.milestone
//     milestones.map((it) => {
//       if (it.id === milestone) {
//         console.log(it)
//       }
//     })
//   })
// }
