import { useState } from 'react';
import { useRouter } from 'next/router';
import {
	useMantineTheme,
	Container,
	Title,
	Button,
	Group,
	Box,
	Select,
	TextInput,
	Text,
} from '@mantine/core';
import styles from '@/styles/add-project.module.css';

function AddProject() {
	const router = useRouter();
	const [renderFields, setRenderFields] = useState(false);
	const theme = useMantineTheme();

	const pageTitle = (
		<div className={styles.cardTitle}>
			<div className={styles.title}>
				<Text color='blue'>
					<Title order={1}>Add Project Page</Title>
				</Text>
			</div>
		</div>
	);

	const staticProviderData = [
		{ value: 'bg', label: 'Backlog' },
		{ value: 'ap', label: 'Add new provider' },
	];

	const staticProjectData = [
		{ value: 'ymt', label: 'Yamato' },
		{ value: 'sf', label: 'Safie' },
		{ value: '01b', label: '01Booster' },
	];

	const handleChange = (data) => {
		if (data === 'ap') {
			setRenderFields(!renderFields);
		} else {
			setRenderFields(false);
		}
	};

	const handleClick = (e) => {
		e.preventDefault();
		router.push(href);
	};

	const connectProvider = (
		// TODO: Will these fields be in a different form or not

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

	return (
		<div>
			<Container fluid color='blue'>
				{pageTitle}
				<Box sx={{ maxWidth: 600 }} mx='auto'>
					<div className={styles.card}>
						{/* TODO: handle submission of data */}
						<form onSubmit={(values) => console.log(values)}>
							<div className={styles.selectProvider}>
								<Text color='blue'>
									<Title order={3}>Select Provider</Title>
								</Text>
								<Select
									placeholder='Select a Provider'
									data={staticProviderData}
									onChange={(val) => handleChange(val)}
									size='lg'
								/>
							</div>
							{!!renderFields && connectProvider}

							<Text color='blue'>
								<Title order={3}>Select Project</Title>
							</Text>
							<Select
								placeholder='Select a Project'
								data={staticProjectData}
								size='lg'
							/>

							<Group position='right' mt='lg'>
								<Button
									onClick={() => router.back('/')}
									variant='light'
									color='dark'
									size='lg'
								>
									Cancel
								</Button>

								<Button size='lg' type='submit'>
									Add Project
								</Button>
							</Group>
						</form>
					</div>
				</Box>
			</Container>
		</div>
	);
}

export default AddProject;
