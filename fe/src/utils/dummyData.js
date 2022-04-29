export const staticProjects = [
  {
    id: 1,
    name: '01booster',
    provider: 'Backlog',
    memberCount: 7,
  },
  {
    id: 2,
    name: 'Safie',
    provider: 'Trello',
    memberCount: 3,
  },
  {
    id: 3,
    name: 'Edge',
    provider: 'Asana',
    memberCount: 2,
  },
  {
    id: 4,
    name: 'Yamato',
    provider: 'Notion',
    memberCount: 8,
  },
  {
    id: 5,
    name: 'Test',
    provider: 'Jira',
    memberCount: 6,
  },
]

export const sprintLabels = [
  'Sprint 1',
  'Sprint 2',
  'Sprint 3',
  'Sprint 4',
  'Sprint 5',
]

export const sprintSelectFields = [
  { value: 1, label: 'Sprint 1' },
  { value: 2, label: 'Sprint 2' },
  { value: 3, label: 'Sprint 3' },
]

export const velocityChartData = {
  estimated: [40, 37, 39, 40, 32],
  actual: [35, 31, 40, 40, 32],
}

export const aaa = [
  {
    milestone: 'Sprint 2',
    issues: [
      {
        id: 16758362,
        actualHours: 0,
        estimatedHours: 8,
        currentStatus: 'In Progress',
      },
      {
        id: 16758350,
        actualHours: 0,
        estimatedHours: 8,
        currentStatus: 'Closed',
      },
      {
        id: 16758341,
        actualHours: 0,
        estimatedHours: 8,
        currentStatus: 'Open',
      },
    ],
  },
  {
    milestone: 'Sprint1',
    issues: [
      {
        id: 16758166,
        actualHours: 0,
        estimatedHours: 8,
        currentStatus: 'Open',
      },
      {
        id: 16758137,
        actualHours: 0,
        estimatedHours: 8,
        currentStatus: 'Open',
      },
      {
        id: 16683650,
        actualHours: 0.25,
        estimatedHours: 8,
        currentStatus: 'Open',
      },
    ],
  },
]

export const burnDownChartData = {
  totalTasks: [30, 32, 32, 35, 36],
  remainingTasks: [30, 21, 15, 12, 5],
}

export const burnUpChartData = {
  totalTasks: [30, 32, 32, 35, 36],
  completedTasks: [0, 11, 17, 23, 31],
}

export const developersList = [
  { name: 'Usada Pekora', position: 'Team Lead' },
  { name: 'Sakura Miko', position: 'Sub Team Lead' },
  { name: 'Ninomae Inanis', position: 'Q.A.' },
  { name: 'Nakiri Ayame', position: 'Developer' },
  { name: 'Tokoyami Towa', position: 'Developer' },
  { name: 'Gawr Gura', position: 'Developer' },
]
