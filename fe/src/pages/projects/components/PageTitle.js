import { Text, Title } from '@mantine/core';
import styles from '@/styles/add-project.module.css';

export default function PageTitle() {
	return (
		<div className={styles.cardTitle}>
			<div className={styles.title}>
				<Text color='blue'>
					<Title order={1}>Add Project Page</Title>
				</Text>
			</div>
		</div>
	);
}
