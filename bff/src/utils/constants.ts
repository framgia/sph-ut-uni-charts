export const backlogServiceIssueResponse = [
  {
    id: 111,
    projectId: 1111,
    issueKey: 'key',
    keyId: 111,
    issueType: {
      id: 111,
      projectId: 111,
      name: 'Task',
      color: '#7ea800',
      displayOrder: 0
    },
    summary: 'text',
    description: '',
    resolution: null,
    priority: { id: 3, name: 'Normal' },
    status: {
      id: 111,
      projectId: 111,
      name: 'Closed',
      color: '#b0be3c',
      displayOrder: 111
    },
    assignee: null,
    category: [],
    versions: [],
    milestone: [],
    startDate: '2022-05-09T00:00:00Z',
    dueDate: '2022-05-09T00:00:00Z',
    estimatedHours: 5,
    actualHours: 3,
    parentIssueId: null,
    createdUser: {
      id: 111,
      userId: null,
      name: 'User',
      roleType: 1,
      lang: 'en',
      mailAddress: null,
      nulabAccount: [],
      keyword: 'User'
    },
    created: '2022-05-02T07:27:00Z',
    updatedUser: {
      id: 111,
      userId: null,
      name: 'User',
      roleType: 1,
      lang: 'en',
      mailAddress: null,
      nulabAccount: [],
      keyword: 'User'
    },
    updated: '2022-05-02T07:27:17Z',
    customFields: [],
    attachments: [],
    sharedFiles: [],
    stars: []
  }
]

export const backlogServiceMilestoneResponse = [
  {
    id: 111,
    projectId: 111,
    issueKey: 'key',
    keyId: 111,
    issueType: {
      id: 111,
      projectId: 111,
      name: 'Task',
      color: '#7ea800',
      displayOrder: 0
    },
    summary: 'Sample 9',
    description: '',
    resolution: null,
    priority: {
      id: 3,
      name: 'Normal'
    },
    status: {
      id: 1,
      projectId: 111,
      name: 'Closed',
      color: '#b0be3c',
      displayOrder: 4000
    },
    assignee: null,
    category: [],
    versions: [
      {
        id: 111,
        projectId: 111,
        name: 'Sprint 1',
        description: 'Sprint 1',
        startDate: '2022-05-09T00:00:00Z',
        releaseDueDate: '2022-05-13T00:00:00Z',
        archived: false,
        displayOrder: 0
      }
    ],
    milestone: [
      {
        id: 111,
        projectId: 111,
        name: 'Sprint 1',
        description: 'Sprint 1',
        startDate: '2022-05-09T00:00:00Z',
        releaseDueDate: '2022-05-13T00:00:00Z',
        archived: false,
        displayOrder: 0
      }
    ],
    startDate: '2022-05-09T00:00:00Z',
    dueDate: '2022-05-09T00:00:00Z',
    estimatedHours: 5,
    actualHours: 3,
    parentIssueId: null,
    createdUser: {
      id: 111,
      userId: null,
      name: 'User',
      roleType: 1,
      lang: 'en',
      mailAddress: null,
      nulabAccount: {
        nulabId: '111',
        name: 'User',
        uniqueId: 'User'
      },
      keyword: 'User'
    },
    created: '2022-05-02T07:27:00Z',
    updatedUser: {
      id: 111,
      userId: null,
      name: 'User',
      roleType: 1,
      lang: 'en',
      mailAddress: null,
      nulabAccount: {
        nulabId: '111',
        name: 'User',
        uniqueId: 'User'
      },
      keyword: 'User'
    },
    updated: '2022-05-02T07:27:17Z',
    customFields: [],
    attachments: [],
    sharedFiles: [],
    stars: []
  }
]
