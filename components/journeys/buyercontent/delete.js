import { gql, useMutation } from '@apollo/client'

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../../global-state';
import { FIND_BUYER_CONTENTS_QUERY } from '../../../lib/queries';

const DELETE_BUYER_CONTENT = gql`
	mutation updateBuyerContent($id: ID!, $deleted: Boolean!) {
		updateBuyerContent(input: { id: $id, deleted: $deleted }) {
			id
			title,
			content
			position
		}
	}
`;

const DeleteBuyerContent = ({ professionId, onDelete, id }) => {
	// Context
	const { deleteBuyerContentModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [deleteBuyerContent, state] = useMutation(
		DELETE_BUYER_CONTENT,
		{
			refetchQueries: [
				{
					query: FIND_BUYER_CONTENTS_QUERY,
					variables: {
						professionId,
					},
				},
			],
		},
	);

	// Methods
	const onCloseModal = () => {
		dispatch({
			type: 'DELETE_BUYER_CONTENT_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await deleteBuyerContent({
			variables: {
				id,
				deleted: true,
			},
		});

		onCloseModal();
		onDelete(result.data.updateBuyerContent);
	}

	return (
		<Modal title="Delete buyer content and asset card" isOpen={deleteBuyerContentModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

				<button type="submit" className="btn btn-danger">Delete</button>
				<button type="button" onClick={() => onCloseModal()} className="btn btn-primary">Cancel</button>
			</form>
		</Modal>
	);
}

export default DeleteBuyerContent;