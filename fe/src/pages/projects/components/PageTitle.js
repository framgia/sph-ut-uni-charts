import { Text, Title } from '@mantine/core'
import styles from '@/styles/add-project.module.css'

export default function PageTitle({ pageTitle }) {
  return (
    <div className={styles.cardTitle}>
      <div className={styles.title}>
        <Text color='blue'>
          <Title order={1}>{pageTitle}</Title>
        </Text>
      </div>
    </div>
  )
}
