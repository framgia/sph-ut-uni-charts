import { Text, Title, TextInput, Button } from '@mantine/core';
import styles from '@/styles/add-project.module.css';

export default function SetProvider() {
	return (
		<>
			<div className={styles.connectProvider}>
				<Text color='blue'>
					<Title order={3}>Enter API Key</Title>
				</Text>
				<TextInput placeholder='Enter API Key' size='lg' />
			</div>
			<div className={styles.connectProviderButton}>
				<Button size='md' type='submit'>
					Connect Provider
				</Button>
			</div>
		</>
	);
}
