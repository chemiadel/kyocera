import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_INDUSTRIES_QUERY } from '../../lib/queries';

const CREATE_INDUSTRY = gql`
	mutation createIndustry($name: String!, $languageId: ID!) {
		createIndustry(input: { name: $name, languageId: $languageId }) {
			id
			name
			language {
				id
				name
			}
		}
	}
`;

const CreateIndustry = ({ languageId, isShow }) => {
	// State
	const [isOpen, setIsOpen] = useState(isShow);
	const [value, setValue] = useState('');

	// Context
	const { createIndustryModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [createIndustry, state] = useMutation(
		CREATE_INDUSTRY,
		{
			refetchQueries: [
				{
					query: FIND_INDUSTRIES_QUERY,
					variables: {
						languageId,
					},
				},
			],
		},
	);

	// Methods
	const onCloseModal = () => {
		dispatch({
			type: 'CREATE_INDUSTRY_MODAL_IS_OPEN',
			payload: false,
		});

		setValue('');
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await createIndustry({
			variables: {
				name: value,
				languageId,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Create new industry" isOpen={createIndustryModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<div className={`form-group ${value.length > 0 ? 'has-value' : ''}`}>
					<label htmlFor="name">Industry Name</label>

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

export default CreateIndustry;