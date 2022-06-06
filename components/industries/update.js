import { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_INDUSTRIES_QUERY } from '../../lib/queries';

const GET_INDUSTRY = gql`
	query getIndustry($id: ID!) {
		getIndustry(id: $id) {
			id
			name
		}
	}
`;
const UPDATE_INDUSTRY = gql`
	mutation updateIndustry($id: ID!, $name: String!) {
		updateIndustry(input: { id: $id, name: $name }) {
			id
			name
		}
	}
`;

const DeleteIndustry = ({ id, languageId }) => {
	// Context
	const globalState = useGlobalState();
	const dispatch = useDispatchGlobalState();
	const [value, setValue] = useState('');

	// GraphQL
	const { data } = useQuery(
		GET_INDUSTRY,
		{
			variables: {
				id: id ?? 0,
			},
		}
	);
	const [updateIndustry, state] = useMutation(
		UPDATE_INDUSTRY,
		{
			refetchQueries: [
				{
					query: FIND_INDUSTRIES_QUERY,
					variables: {
						languageId,
					},
				},
				{
					query: GET_INDUSTRY,
					variables: {
						id: id ?? 0,
					}
				}
			],
		},
	);

	useEffect(() => {
		if (data && data.getIndustry) {
			setValue(data.getIndustry.name);
		}
	}, [globalState.updateIndustryModalIsOpen, data]);

	// Methods
	const onCloseModal = () => {
		setValue('');

		dispatch({
			type: 'UPDATE_INDUSTRY_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		await updateIndustry({
			variables: {
				id,
				name: value,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Delete industry" isOpen={globalState.updateIndustryModalIsOpen} onClose={() => onCloseModal()}>
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
		
			<button type="submit" className="btn btn-primary">{state.loading ? 'Loading' : 'Update'}</button>
		</form>
		</Modal>
	);
}

export default DeleteIndustry;