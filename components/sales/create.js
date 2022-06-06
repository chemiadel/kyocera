import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Modal from '@/components/modal';
import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_SALES_QUERY } from '../../lib/queries';

const CREATE_SALES = gql`
	mutation createSales($name: String!, $firstAsset: FirstAssetEnum, $secondAsset: SecondAssetEnum, $industryId: ID!) {
		createSale(input: { name: $name, firstAsset: $firstAsset, secondAsset: $secondAsset, industryId: $industryId }) {
			id
			name
			firstAsset
			secondAsset
		}
	}
`;

const CreateSales = ({ industryId }) => {
	// State
	const [value, setValue] = useState('');
	const [firstAsset, setFirstAsset] = useState('GREEN_GREEN');
	const [secondAsset, setSecondAsset] = useState('GREEN');

	// Context
	const { createSalesModalIsOpen } = useGlobalState();
	const dispatch = useDispatchGlobalState();
	
	// GraphQL
	const [createSales, state] = useMutation(
		CREATE_SALES,
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
			type: 'CREATE_SALES_MODAL_IS_OPEN',
			payload: false,
		});

		setValue('');
	}

	const onSubmit = async e => {
		e.preventDefault();

		await createSales({
			variables: {
				name: value,
				industryId,
				firstAsset,
				secondAsset,
			},
		});

		onCloseModal();
	}

	return (
		<Modal title="Create new sales process" isOpen={createSalesModalIsOpen} onClose={() => onCloseModal()}>
			<form onSubmit={(e) => onSubmit(e)}>
				<div className={`form-group ${value.length > 0 ? 'has-value' : ''}`}>
					<label htmlFor="name">Sales Process Name</label>

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
					<select onChange={e => setFirstAsset(e.target.value)} className="form-control">
						<option value="GREEN_GREEN">{`green -> green`}</option>
						<option value="BLUE_BLUE_GREEN_GREEN_GREEN">{`blue -> blue -> green -> green -> green`}</option>
						<option value="BLUE_BLUE_BLUE_BLUE_BLUE_GREEN_GREEN">{`blue -> blue -> blue -> blue -> blue -> green -> green`}</option>
					</select>
				</div>

				<div className="form-group">
					<select onChange={e => setSecondAsset(e.target.value)} className="form-control">
						<option value="GREEN">{`green`}</option>
						<option value="BLUE_GREEN">{`blue -> green`}</option>
					</select>
				</div>
			
				<button type="submit" className="btn btn-primary">{state.loading ? 'Loading' : 'Create'}</button>
			</form>
		</Modal>
	);
}

export default CreateSales;