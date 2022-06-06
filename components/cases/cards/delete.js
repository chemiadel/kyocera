import { gql, useMutation } from '@apollo/client'

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_CASES_QUERY } from '../../../lib/queries';

const DELETE_CASES_CARD = gql`
	mutation updateCaseCard($id: ID!, $deleted: Boolean!) {
		updateCaseCard(input: { id: $id, deleted: $deleted }) {
			id
			title,
			content
			position
		}
	}
`;

const DeleteCasesCard = ({ industryId, onDelete, id }) => {
	// Context
	const { deleteCasesCardModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [deleteCaseCard, state] = useMutation(
		DELETE_CASES_CARD,
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
			type: 'DELETE_CASES_CARD_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await deleteCaseCard({
			variables: {
				id,
				deleted: true,
			},
		});

		onCloseModal();
		onDelete(result.data.updateCaseCard);
	}

	return (
		<Modal title="Delete sales processes card" isOpen={deleteCasesCardModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

				<button type="submit" className="btn btn-danger">Delete</button>
				<button type="button" onClick={() => onCloseModal()} className="btn btn-primary">Cancel</button>
			</form>
		</Modal>
	);
}

export default DeleteCasesCard;