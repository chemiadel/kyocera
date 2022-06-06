import { gql, useMutation } from '@apollo/client'

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_PROFESSIONS_QUERY } from '../../lib/queries';

const DELETE_PROFESSION = gql`
	mutation updateProfession($id: ID!, $deleted: Boolean!) {
		updateProfession(input: { id: $id, deleted: $deleted }) {
			id
			name
		}
	}
`;

const DeleteProfession = ({ industryId, id }) => {
	// Context
	const { deleteProfessionModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [deleteProfession, state] = useMutation(
		DELETE_PROFESSION,
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
			type: 'DELETE_PROFESSION_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await deleteProfession({
			variables: {
				id,
				deleted: true,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Delete profession" isOpen={deleteProfessionModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

				<button type="submit" className="btn btn-danger">Delete</button>
				<button type="button" onClick={() => onCloseModal()} className="btn btn-primary">Cancel</button>
			</form>
		</Modal>
	);
}

export default DeleteProfession;