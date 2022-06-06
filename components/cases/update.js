import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_CASES_QUERY } from '../../lib/queries';

const UPDATE_CASES = gql`
	mutation updateCases($id: ID!, $name: String!) {
		updateCase(input: { id: $id, name: $name }) {
			id
			name
			
			cards(filter: { deleted: { ne: true } }) {
				id
				title
				position
				content
			}
		}
	}
`;

const UpdateCases = ({ id, industryId, name, onClose, onUpdate }) => {
	// State
	const [value, setValue] = useState(name ?? '');

	// Context
	const { updateCasesModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [updateCases, state] = useMutation(
		UPDATE_CASES,
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
			type: 'UPDATE_CASES_MODAL_IS_OPEN',
			payload: false,
		});

		setValue('');

		onClose();
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await updateCases({
			variables: {
				id,
				name: value,
			},
		});

		onCloseModal();
		onUpdate(result.data.updateCase);
	}

	return (
		<Modal title="Update" isOpen={updateCasesModalIsOpen} onClose={() => onCloseModal()}>
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
			
				<button type="submit" className="btn btn-primary">{state.loading ? 'Loading' : 'Update'}</button>
			</form>
		</Modal>
	);
}

export default UpdateCases;