import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_PROFESSIONS_QUERY } from '../../lib/queries';

const CREATE_PROFESSION = gql`
	mutation createProfession($name: String!, $industryId: ID!) {
		createProfession(input: { name: $name, industryId: $industryId }) {
			id
			name
		}
	}
`;

const CreateProfession = ({ industryId, isShow }) => {
	// State
	const [value, setValue] = useState('');

	// Context
	const { createProfessionModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [createProfession, state] = useMutation(
		CREATE_PROFESSION,
		{
			refetchQueries: [
				{
					query: FIND_PROFESSIONS_QUERY,
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
			type: 'CREATE_PROFESSION_MODAL_IS_OPEN',
			payload: false,
		});

		setValue('');
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await createProfession({
			variables: {
				name: value,
				industryId,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Create new profession" isOpen={createProfessionModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<div className={`form-group ${value.length > 0 ? 'has-value' : ''}`}>
					<label htmlFor="name">Profession Name</label>

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

export default CreateProfession;