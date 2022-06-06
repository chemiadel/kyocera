import { gql, useMutation } from '@apollo/client'

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_SALES_QUERY } from '../../lib/queries';

const DELETE_SALES = gql`
	mutation updateSale($id: ID!, $deleted: Boolean!) {
		updateSale(input: { id: $id, deleted: $deleted }) {
			id
			name
		}
	}
`;

const DeleteSales = ({ industryId, id, onDelete }) => {
	// Context
	const { deleteSalesModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();

	// GraphQL
	const [deleteSale, state] = useMutation(
		DELETE_SALES,
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
			type: 'DELETE_SALES_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await deleteSale({
			variables: {
				id,
				deleted: true,
			},
		});

		onCloseModal();

		onDelete(result.data.updateSale);
	}

	return (
		<Modal title="Delete sales processes item" isOpen={deleteSalesModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

				<button type="submit" className="btn btn-danger">Delete</button>
				<button type="button" onClick={() => onCloseModal()} className="btn btn-primary">Cancel</button>
			</form>
		</Modal>
	);
}

export default DeleteSales;