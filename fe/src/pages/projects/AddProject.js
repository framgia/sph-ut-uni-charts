import { useEffect, useState } from 'react'
import styles from '@/styles/add-project.module.css'
import {
  getProviders,
  addProvider,
  getBacklogProjects,
} from '@/src/services/bffService'
import { useForm } from '@mantine/form'
import FullPageSpinner from '@/src/components/molecules/FullPageSpinner'
import { PageTitle, FormProvider } from '@/src/pages/projects/components'
import {
  Container,
  Group,
  Box,
  Select,
  Title,
  Text,
  Button,
  Notification,
} from '@mantine/core'
import { Check, X } from 'tabler-icons-react'

function AddProject() {
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState(null)
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
      setNotif({
        icon: <Check size={18} />,
        color: 'teal',
        title: 'Successful',
        content: 'Provider added successfully',
      })
      resetForm()
    } catch (error) {
      error?.response?.data?.map(({ message }) =>
        setNotif({
          icon: <X size={18} />,
          color: 'red',
          title: 'Error',
          content: message,
        })
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserProviders()
  }, [])

  return (
    <div>
      {loading && <FullPageSpinner />}
      {notif && (
        <Notification
          icon={notif.icon}
          color={notif.color}
          title={notif.title}
          onClose={() => setNotif(null)}
        >
          {notif.content}
        </Notification>
      )}

      <Container fluid color='blue'>
        <PageTitle pageTitle='ADD PROJECT' />
        <Box sx={{ maxWidth: 600 }} mx='auto'>
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
      </Container>
    </div>
  )
}

export default AddProject
