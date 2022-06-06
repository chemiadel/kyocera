import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_CASES_QUERY } from '../../lib/queries';

const CREATE_CASES = gql`
	mutation createCases($name: String!, $industryId: ID!) {
		createCase(input: { name: $name, industryId: $industryId }) {
			id
			name
		}
	}
`;

const CreateCases = ({ industryId }) => {
	// State
	const [value, setValue] = useState('');

	// Context
	const { createCasesModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [createCases, state] = useMutation(
		CREATE_CASES,
		{
			refetchQueries: [
				{
					query: FIND_CASES_QUERY,
					variables: {
						industryId,
					},
				},
			],
		},
	);

	// Methods
	const onCloseModal = () => {
		dispatch({
			type: 'CREATE_CASES_MODAL_IS_OPEN',
			payload: false,
		});

		setValue('');
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await createCases({
			variables: {
				name: value,
				industryId,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Create new" isOpen={createCasesModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<div className={`form-group ${value.length > 0 ? 'has-value' : ''}`}>
					<label htmlFor="name">Name</label>

					<input
						type="text"
						className="form-control"
						id="name"
						required
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
				</div>

				<button type="submit" className="btn btn-primary">{state.loading ? 'Loading' : 'Create'}</button>
			</form>
		</Modal>
	);
}

export default CreateCases;