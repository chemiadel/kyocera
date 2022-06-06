import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_SALES_QUERY } from '../../lib/queries';

const UPDATE_SALES = gql`
	mutation updateSales($id: ID!, $name: String!, $firstAsset: FirstAssetEnum, $secondAsset: SecondAssetEnum) {
		updateSale(input: { id: $id, name: $name, firstAsset: $firstAsset, secondAsset: $secondAsset }) {
			id
			name
			firstAsset
			secondAsset
			
			cards(filter: { deleted: { ne: true } }) {
				id
				title
				position
				content
			}
		}
	}
`;

const UpdateSales = ({ id, industryId, name, onClose, onUpdate, ...props }) => {
	// State
	const [value, setValue] = useState(name ?? '');
	const [firstAsset, setFirstAsset] = useState(props.firstAsset ?? 'GREEN_GREEN');
	const [secondAsset, setSecondAsset] = useState(props.secondAsset ?? 'GREEN');

	// Context
	const { updateSalesModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [updateSales, state] = useMutation(
		UPDATE_SALES,
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
			type: 'UPDATE_SALES_MODAL_IS_OPEN',
			payload: false,
		});

		setValue('');
		setFirstAsset('GREEN_GREEN');
		setSecondAsset('GREEN');

		onClose();
	}

	const onSubmit = async e => {
		e.preventDefault();

		const result = await updateSales({
			variables: {
				id,
				name: value,
				firstAsset,
				secondAsset,
			},
		});

		onCloseModal();
		onUpdate(result.data.updateSale);
	}

	return (
		<Modal title="Update" isOpen={updateSalesModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<div className={`form-group ${value.length > 0 ? 'has-value' : ''}`}>
					<label htmlFor="name">Name</label>

					<input
						type="text"
						className="form-control"
						id="name"
						required
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<select onChange={e => setFirstAsset(e.target.value)} className="form-control" value={firstAsset}>
						<option value="GREEN_GREEN">{`green -> green`}</option>
						<option value="BLUE_BLUE_GREEN_GREEN_GREEN">{`blue -> blue -> green -> green -> green`}</option>
						<option value="BLUE_BLUE_BLUE_BLUE_BLUE_GREEN_GREEN">{`blue -> blue -> blue -> blue -> blue -> green -> green`}</option>
					</select>
				</div>

				<div className="form-group">
					<select onChange={e => setSecondAsset(e.target.value)} className="form-control" value={secondAsset}>
						<option value="GREEN">{`green`}</option>
						<option value="BLUE_GREEN">{`blue -> green`}</option>
					</select>
				</div>
			
				<button type="submit" className="btn btn-primary">{state.loading ? 'Loading' : 'Update'}</button>
			</form>
		</Modal>
	);
}

export default UpdateSales;