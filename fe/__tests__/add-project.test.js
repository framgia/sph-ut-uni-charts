import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddProject from '@/src/pages/add-project';

describe('Add Project', () => {
	it('Has a header', () => {
		render(<AddProject />);
		const header = screen.getByRole('heading', { name: /add project page/i });

		expect(header).toBeInTheDocument();
	});

	it('Has 2 dropdown buttons and 1 submit button', () => {
		render(<AddProject />);
		const providerDropdown = screen.getByPlaceholderText(/select a provider/i);
		const projectDropdown = screen.getByPlaceholderText(/select a project/i);
		const dropdownFields = screen.getAllByRole('textbox');
		const addProjectButton = screen.getByRole('button', {
			name: /add project/i,
		});

		expect(providerDropdown).toBeInTheDocument();
		expect(projectDropdown).toBeInTheDocument();
		expect(dropdownFields).toHaveLength(2);
		expect(addProjectButton).toBeInTheDocument();
	});

	it('initial values under provider dropdown', async () => {
		render(<AddProject />);
		const providerDropdown = screen.getByPlaceholderText(/select a provider/i);

		userEvent.click(providerDropdown);

		const initialOptions = await screen.findAllByRole('option');

		expect(initialOptions).toHaveLength(2);
	});

	it('user clicks add new provider option', () => {
		render(<AddProject />);
		const providerDropdown = screen.getByPlaceholderText(/select a provider/i);

		userEvent.click(providerDropdown);

		const addProvider = screen.getByRole('option', {
			name: /add new provider/i,
		});

		expect(addProvider).toBeInTheDocument();

		userEvent.click(addProvider);

		const apiKey = screen.getByPlaceholderText(/enter api key/i);

		const connectButton = screen.getByRole('button', {
			name: /connect provider/i,
		});

		expect(apiKey).toBeInTheDocument();
		expect(connectButton).toBeInTheDocument();
	});

	it('initial values under project dropdown', async () => {
		render(<AddProject />);

		const projectDropdown = screen.getByPlaceholderText(/select a project/i);
		userEvent.click(projectDropdown);

		const listProjects = await screen.findAllByRole('option');
		const projects = listProjects.map((proj) => proj.textContent);
		expect(projects).toEqual(['Yamato', 'Safie', '01Booster']);
	});

	it('Action buttons', () => {
		render(<AddProject />);

		const addProjectButton = screen.getByRole('button', {
			name: /add project/i,
		});

		const cancelButton = screen.getByRole('button', { name: /cancel/i });

		expect(addProjectButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});
});
