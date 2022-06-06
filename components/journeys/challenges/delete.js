import { gql, useMutation } from '@apollo/client'

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_JOURNEYS_QUERY } from '../../../lib/queries';

const DELETE_CHALLENGE_MUTATION = gql`
	mutation updateChallenge($id: ID!, $deleted: Boolean!) {
		updateChallenge(input: { id: $id, deleted: $deleted }) {
			id
			title
			content
		}
	}
`;

const DeleteChallenge = ({ industryId, professionId, languageId, onDelete, id }) => {
	// Context
	const { deleteChallengeModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [deleteChallenge, state] = useMutation(
		DELETE_CHALLENGE_MUTATION,
		{
			refetchQueries: [
				{
					query: FIND_JOURNEYS_QUERY,
					variables: {
						industryId,
						professionId,
						languageId,
					},
				},
			],
		},
	);

	// Methods
	const onCloseModal = () => {
		dispatch({
			type: 'DELETE_CHALLENGE_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await deleteChallenge({
			variables: {
				id,
				deleted: true,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Delete" isOpen={deleteChallengeModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

				<button type="submit" className="btn btn-danger">Delete</button>
				<button type="button" onClick={() => onCloseModal()} className="btn btn-primary">Cancel</button>
			</form>
		</Modal>
	);
}

export default DeleteChallenge;