import { useEffect, useState } from 'react'
import styles from '@/styles/add-project.module.css'
import {
  getProviders,
  addProvider,
  getBacklogProjects,
} from '@/src/api/providerApi'
import { useForm } from '@mantine/form'
import FullPageSpinner from '@/src/components/molecules/FullPageSpinner'
import { FormProvider } from '@/src/pages/projects/components'
import { showNotification } from '@mantine/notifications'
import { Group, Box, Select, Title, Text, Button } from '@mantine/core'

function AddProject() {
  const [loading, setLoading] = useState(false)
  const [showProviderFields, setshowProviderFields] = useState(false)

  const [providers, setProviders] = useState([])
  const [projects, setProjects] = useState([])
  const [apiKey, setApiKey] = useState('')
  const [selectedProvider, setSelectedProvider] = useState(null)

  const staticProviderData = [{ value: 'ap', label: 'Add new provider' }]

  const formProvider = useForm({
    initialValues: {
      apiKey,
    },

    validate: {
      apiKey: (value) => (!value ? 'API key is required' : null),
    },
  })

  const formProject = useForm({
    initialValues: {
      project_id: 0,
    },

    validate: {
      project_id: (value) => (!value ? 'Please select a project' : null),
    },
  })

  const resetForm = () => {
    setshowProviderFields(false)
    setSelectedProvider(null)
    setProjects([])
    setApiKey('')
    getUserProviders()
  }

  const getUserProviders = async () => {
    setLoading(true)
    const data = []
    const result = await getProviders()
    result?.data?.map((provider) => {
      const backlogProvider = {
        label: `${provider.name} - ${provider.space_key}`,
        value: provider.id,
      }
      data.push(backlogProvider)
    })
    setProviders([...data, ...staticProviderData])
    setLoading(false)
  }

  const handleConnectProvider = async (values) => {
    setLoading(true)
    setApiKey(values.apiKey)
    try {
      const result = await getBacklogProjects(values)
      const data = []
      result.data.map((project) => {
        data.push({
          label: project.name,
          value: project.id,
        })
      })
      setProjects(data)
    } catch (error) {
      formProvider.setErrors({ apiKey: 'Invalid API Key' })
    }
    setLoading(false)
  }

  const handleChangeProvider = (value) => {
    setProjects([])
    if (value === 'ap') {
      setshowProviderFields(true)
    } else {
      setshowProviderFields(false)
      setSelectedProvider(value)
      handleConnectProvider({ providerId: value })
    }
  }

  const handleAddProvider = async (values) => {
    setLoading(true)
    const payload = {
      ...values,
      api_key: apiKey,
      name: 'Backlog',
      id: selectedProvider,
    }

    try {
      await addProvider(payload)
      showNotification({
        color: 'teal',
        message: 'Provider added successfully',
      })
      resetForm()
    } catch (error) {
      error?.response?.data?.map(({ message }) =>
        showNotification({ color: 'red', message })
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserProviders()
  }, [])

  return (
    <>
      {loading && <FullPageSpinner />}

      <Box sx={{ width: '50%' }}>
        <div className={styles.card}>
          <div className={styles.selectProvider}>
            <Text color='blue'>
              <Title order={3}>Select Provider</Title>
            </Text>
            <Select
              placeholder='Select a Provider'
              data={providers}
              onChange={handleChangeProvider}
              size='lg'
            />
          </div>
          {showProviderFields && (
            <FormProvider
              formProvider={formProvider}
              handleConnectProvider={handleConnectProvider}
            />
          )}

          {projects.length ? (
            <form onSubmit={formProject.onSubmit(handleAddProvider)}>
              <Text color='blue'>
                <Title order={3}>Select Project</Title>
              </Text>
              <Select
                placeholder='Select a Project'
                data={projects}
                size='lg'
                {...formProject.getInputProps('project_id')}
              />

              <Group position='right' mt='lg'>
                <Button size='lg' type='submit'>
                  Add Project
                </Button>
              </Group>
            </form>
          ) : null}
        </div>
      </Box>
    </>
  )
}

export default AddProject
