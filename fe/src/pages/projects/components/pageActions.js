import Router from 'next/router';
import { Button } from '@mantine/core';

export default function PageActions() {
	return (
		<>
			<Button
				onClick={() => Router.push('/')}
				variant='light'
				color='dark'
				size='lg'
			>
				Cancel
			</Button>
			<Button size='lg' type='submit'>
				Add Project
			</Button>
		</>
	);
}
