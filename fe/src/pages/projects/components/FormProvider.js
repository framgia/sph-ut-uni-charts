import { Text, Title, TextInput, Button } from '@mantine/core'
import styles from '@/styles/add-project.module.css'
import { useForm } from '@mantine/form'

const FormProvider = ({ formProvider, handleConnectProvider }) => {
  return (
    <>
      <form onSubmit={formProvider.onSubmit(handleConnectProvider)}>
        <div className={styles.connectProvider}>
          <Text color='blue'>
            <Title order={3}>Enter API Key</Title>
          </Text>
          <TextInput
            placeholder='Enter API Key'
            size='lg'
            {...formProvider.getInputProps('apiKey')}
          />
        </div>
        <div className={styles.connectProviderButton}>
          <Button size='md' type='submit'>
            Connect Provider
          </Button>
        </div>
      </form>
    </>
  )
}

export default FormProvider
