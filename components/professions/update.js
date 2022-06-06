import { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_PROFESSIONS_QUERY } from '../../lib/queries';

const GET_PROFESSION = gql`
	query getProfession($id: ID!) {
		getProfession(id: $id) {
			id
			name
		}
	}
`;
const UPDATE_PROFESSION = gql`
	mutation updateProfession($id: ID!, $name: String!) {
		updateProfession(input: { id: $id, name: $name }) {
			id
			name
		}
	}
`;

const UpdateProfession = ({ industryId, id }) => {
	// Context
	const globalState = useGlobalState();
	const dispatch = useDispatchGlobalState();
	const [value, setValue] = useState('');

	// GraphQL
	const { data } = useQuery(
		GET_PROFESSION,
		{
			variables: {
				id: id ?? 0,
			},
		}
	);
	const [updateProfession, state] = useMutation(
		UPDATE_PROFESSION,
		{
			refetchQueries: [
				{
					query: FIND_PROFESSIONS_QUERY,
					variables: {
						industryId,
					},
				},
				{
					query: GET_PROFESSION,
					variables: {
						id: id ?? 0,
					}
				}
			],
		},
	);

	useEffect(() => {
		if (data && data.getProfession) {
			setValue(data.getProfession.name);
		}
	}, [globalState.updateProfessionModalIsOpen, data]);

	// Methods
	const onCloseModal = () => {
		setValue('');

		dispatch({
			type: 'UPDATE_PROFESSION_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		await updateProfession({
			variables: {
				id,
				name: value,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Delete profession" isOpen={globalState.updateProfessionModalIsOpen} onClose={() => onCloseModal()}>
		<form onSubmit={(e) => onSubmit(e)}>
			<div className={`form-group ${value.length > 0 ? 'has-value' : ''}`}>
				<label htmlFor="name">Profession Name</label>

				<input
					type="text"
					className="form-control"
					id="name"
					value={value}
					required
					onChange={(e) => setValue(e.target.value)}
				/>
			</div>
		
			<button type="submit" className="btn btn-primary">{state.loading ? 'Loading' : 'Update'}</button>
		</form>
		</Modal>
	);
}

export default UpdateProfession;