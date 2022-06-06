import { gql, useMutation } from '@apollo/client'

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_INDUSTRIES_QUERY } from '../../lib/queries';

const DELETE_INDUSTRY = gql`
	mutation updateIndustry($id: ID!, $deleted: Boolean!) {
		updateIndustry(input: { id: $id, deleted: $deleted }) {
			id
			name
		}
	}
`;

const DeleteIndustry = ({ onDelete, id, languageId }) => {
	// Context
	const { deleteIndustryModalIsOpen, language } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [deleteIndustry, state] = useMutation(
		DELETE_INDUSTRY,
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
			type: 'DELETE_INDUSTRY_MODAL_IS_OPEN',
			payload: false,
		});
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await deleteIndustry({
			variables: {
				id,
				deleted: true,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Delete industry" isOpen={deleteIndustryModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

				<button type="submit" className="btn btn-danger">Delete</button>
				<button type="button" onClick={() => onCloseModal()} className="btn btn-primary">Cancel</button>
			</form>
		</Modal>
	);
}

export default DeleteIndustry;