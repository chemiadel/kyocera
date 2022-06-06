import { gql, useMutation } from '@apollo/client'

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_CASES_QUERY } from '../../lib/queries';

const DELETE_CASES = gql`
	mutation updateCase($id: ID!, $deleted: Boolean!) {
		updateCase(input: { id: $id, deleted: $deleted }) {
			id
			name
		}
	}
`;

const DeleteCases = ({ industryId, id, onDelete }) => {
	// Context
	const { deleteCasesModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();

	// GraphQL
	const [deleteCase, state] = useMutation(
		DELETE_CASES,
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
			type: 'DELETE_CASES_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await deleteCase({
			variables: {
				id,
				deleted: true,
			},
		});

		onCloseModal();

		onDelete(result.data.updateCase);
	}

	return (
		<Modal title="Delete sales processes item" isOpen={deleteCasesModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

				<button type="submit" className="btn btn-danger">Delete</button>
				<button type="button" onClick={() => onCloseModal()} className="btn btn-primary">Cancel</button>
			</form>
		</Modal>
	);
}

export default DeleteCases;