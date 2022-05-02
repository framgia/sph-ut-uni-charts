import { useState } from 'react'
import { Container, Group, Box, Select, Title, Text } from '@mantine/core'
import styles from '@/styles/add-project.module.css'
import { PageTitle, PageActions, FormProvider } from '@/src/pages/projects/components'
import AuthMiddleware from '@/src/components/molecules/AuthMiddleware'

function AddProject() {
  const [showProviderFields, setshowProviderFields] = useState(false)

  const staticProviderData = [
    { value: 'bg', label: 'Backlog' },
    { value: 'ap', label: 'Add new provider' }
  ]

  const staticProjectData = [
    { value: 'ymt', label: 'Yamato' },
    { value: 'sf', label: 'Safie' },
    { value: '01b', label: '01Booster' }
  ]

  const handleChange = (data) => {
    if (data === 'ap') {
      setshowProviderFields(!showProviderFields)
    } else {
      setshowProviderFields(false)
    }
  }

  return (
    <AuthMiddleware>
      <Container fluid color="blue">
        <PageTitle pageTitle="Add Project Page" />
        <Box sx={{ maxWidth: 600 }} mx="auto">
          <div className={styles.card}>
            {/* TODO: handle submission of data */}
            <form onSubmit={(values) => console.log(values)}>
              <div className={styles.selectProvider}>
                <Text color="blue">
                  <Title order={3}>Select Provider</Title>
                </Text>
                <Select
                  placeholder="Select a Provider"
                  data={staticProviderData}
                  onChange={(val) => handleChange(val)}
                  size="lg"
                />
              </div>
              {showProviderFields && <FormProvider />}

              <Text color="blue">
                <Title order={3}>Select Project</Title>
              </Text>
              <Select placeholder="Select a Project" data={staticProjectData} size="lg" />

              <Group position="right" mt="lg">
                <PageActions />
              </Group>
            </form>
          </div>
        </Box>
      </Container>
    </AuthMiddleware>
  )
}

export default AddProject
