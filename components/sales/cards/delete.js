import { gql, useMutation } from '@apollo/client'

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_SALES_QUERY } from '../../../lib/queries';

const DELETE_SALES_CARD = gql`
	mutation updateSaleCard($id: ID!, $deleted: Boolean!) {
		updateSaleCard(input: { id: $id, deleted: $deleted }) {
			id
			title,
			content
			position
		}
	}
`;

const DeleteSalesCard = ({ industryId, onDelete, id }) => {
	// Context
	const { deleteSalesCardModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [deleteSaleCard, state] = useMutation(
		DELETE_SALES_CARD,
		{
			refetchQueries: [
				{
					query: FIND_SALES_QUERY,
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
			type: 'DELETE_SALES_CARD_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await deleteSaleCard({
			variables: {
				id,
				deleted: true,
			},
		});

		onCloseModal();
		onDelete(result.data.updateSaleCard);
	}

	return (
		<Modal title="Delete sales processes card" isOpen={deleteSalesCardModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

				<button type="submit" className="btn btn-danger">Delete</button>
				<button type="button" onClick={() => onCloseModal()} className="btn btn-primary">Cancel</button>
			</form>
		</Modal>
	);
}

export default DeleteSalesCard;