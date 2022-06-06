import { useState } from 'react';
import { useQuery } from '@apollo/client'

import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_INDUSTRIES_QUERY } from '../../lib/queries';

// Modals
import CreateIndustry from './create';
import DeleteIndustry from './delete';
import UpdateIndustry from './update';

const IndustriesList = ({ activeIndustry, onSelect, languageId, role }) => {
	// State
	const [selectedIndustryId, setSelectedIndustryId] = useState(null);

	// Context
	const dispatch = useDispatchGlobalState();

	// GraphQL
	const { loading, data } = useQuery(
		FIND_INDUSTRIES_QUERY,
		{
			variables: {
				languageId,
			},
		},
	);

	// Methods
	const openCreateIndustryModal = (e) => {
		e.preventDefault();

		dispatch({
			type: 'CREATE_INDUSTRY_MODAL_IS_OPEN',
			payload: true,
		})
	}
	
	const openUpdateIndustryModal = (e, id) => {
		e.preventDefault();

		setSelectedIndustryId(id);

		dispatch({
			type: 'UPDATE_INDUSTRY_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openDeleteIndustryModal = (e, id) => {
		e.preventDefault();

		setSelectedIndustryId(id);

		dispatch({
			type: 'DELETE_INDUSTRY_MODAL_IS_OPEN',
			payload: true,
		})
	}

	// Components
	const Item = ({ name, id }) => (
		<div className="radio is-have-actions">
			{(role === 'ADMIN') && (
				<div className="actions">
					<button className="edit" type="button" onClick={(e) => openUpdateIndustryModal(e, id)}>
						<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
					</button>

					<button className="delete" type="button" onClick={(e) => openDeleteIndustryModal(e, id)}>
						<i><svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
					</button>
				</div>
			)}
			{(role === 'EDITOR') && (
				<div className="actions">
					<button className="edit" type="button" onClick={(e) => openUpdateIndustryModal(e, id)}>
						<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
					</button>
				</div>
			)}
			<input
				type="radio"
				name="industry"
				id={name}
				checked={activeIndustry === id}
				onChange={() => onSelect({ id, name })}
				hidden
			/>

			<label htmlFor={name}>
				{name}

				<div className="active">
					<img src="/img/radio-selected.svg" alt="" />
				</div>
			</label>
		</div>
	);

	const RenderList = () => {
		if (loading) {
			return <p style={{ fontSize: 16 }}>Loading</p>;
		}

		if (data.findIndustries.items.length === 0) {
			return (
				<p style={{ fontSize: 16 }}>
					No industries found.
				
					{(role === 'ADMIN' || role === 'EDITOR') && (
						<>
							{` `}
							<a
								href="#"
								style={{ color: '#0a9bcd' }}
								onClick={(e) => openCreateIndustryModal(e)}
							>
								Create One
							</a>
						</>
					)}
				</p>
			);
		}

		return (
			<>
				{data.findIndustries.items.map(({ id, name }) => (
					<Item key={id} id={id} name={name} />
				))}

				{(role === 'ADMIN' || role === 'EDITOR') && (
					<button
						className="add-new-button"
						type="button"
						style={{ marginBottom: 20 }}
						onClick={(e) => openCreateIndustryModal(e)}
					>
						+
					</button>
				)}
			</>
		);
	}

	return (
		<>
			<div className="select-industry-body-list">
				<RenderList />
			</div>

			{(role === 'ADMIN') && (
				<>
					<CreateIndustry languageId={languageId} />
					
					<UpdateIndustry languageId={languageId} id={selectedIndustryId} />

					<DeleteIndustry languageId={languageId} id={selectedIndustryId} />
				</>
			)}
						{(role === 'EDITOR') && (
				<>
					<CreateIndustry languageId={languageId} />
					
					<UpdateIndustry languageId={languageId} id={selectedIndustryId} />
				</>
			)}
		</>
	);
}

export default IndustriesList;
