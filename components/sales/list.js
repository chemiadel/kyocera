import { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import htmlRender from 'react-html-parser';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useDispatchGlobalState } from '../global-state';
import { FIND_SALES_QUERY } from '../../lib/queries';

import Card from '@/components/card';
import ProcessBarWidget from '../widget/process-bar.widget';

// Modals
import DeleteSales from './delete';
import UpdateSales from './update';
import CreateSales from './create';

// Card Modals
import CreateSalesCard from './cards/create';
import UpdateSalesCard from './cards/update';
import DeleteSalesCard from './cards/delete';
import { useRouter } from 'next/router';

const CHANGE_CARD_POSITIONS_MUTATION = gql`
	mutation changeCardPositions($ids: [ID]!) {
		updateSalesCardPositions(input: { ids: $ids }) {
			id
			position
		}
	}
`;

const SalesList = ({ industryId, role }) => {
	const router = useRouter();

	// State
	const [activeSale, setActiveSale] = useState(null);
	const [selectedSalesId, setSelectedSalesId] = useState(null);
	const [selectedSalesName, setSelectedSalesName] = useState(null);
	const [selectedSalesFirstAsset, setSelectedSalesFirstAsset] = useState(null);
	const [selectedSalesSecondAsset, setSelectedSalesSecondAsset] = useState(null);

	const [selectedSalesCardId, setSelectedSalesCardId] = useState(null);
	const [selectedSalesCardTitle, setSelectedSalesCardTitle] = useState('');
	const [selectedSalesCardContent, setSelectedSalesCardContent] = useState('');
	const [selectedSalesCardFiles, setSelectedSalesCardFiles] = useState(null);
	const [reOrderedList, setReOrderedList] = useState([]);

	// Context
	const dispatch = useDispatchGlobalState();

	// GraphQL
	const { loading, data } = useQuery(
		FIND_SALES_QUERY,
		{
			variables: {
				industryId,
			},
		},
	);

	const [changeCardPositions] = useMutation(CHANGE_CARD_POSITIONS_MUTATION);

	useEffect(() => {
		console.log(data);
		if (data?.findSales?.items.length > 0) {
			setActiveSale(data.findSales.items[0]);
		}
	}, [router.query.industry, data]);

	// Methods
	const openCreateSalesModal = (e) => {
		e.preventDefault();

		dispatch({
			type: 'CREATE_SALES_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openUpdateSalesModal = (e, id, name, firstAsset, secondAsset) => {
		e.preventDefault();

		setSelectedSalesId(id);
		setSelectedSalesName(name);
		setSelectedSalesFirstAsset(firstAsset);
		setSelectedSalesSecondAsset(secondAsset);

		dispatch({
			type: 'UPDATE_SALES_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openDeleteSalesModal = (e, id) => {
		e.preventDefault();

		setSelectedSalesId(id);

		dispatch({
			type: 'DELETE_SALES_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openCreateSalesCardModal = (e) => {
		e.preventDefault();

		dispatch({
			type: 'CREATE_SALES_CARD_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openUpdateSalesCardModal = (e, id, title, content, files) => {
		e.preventDefault();

		setSelectedSalesCardId(id);
		setSelectedSalesCardTitle(title);
		setSelectedSalesCardContent(content);
		setSelectedSalesCardFiles(files);

		dispatch({
			type: 'UPDATE_SALES_CARD_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openDeleteSalesCardModal = (e, id) => {
		e.preventDefault();

		setSelectedSalesCardId(id);

		dispatch({
			type: 'DELETE_SALES_CARD_MODAL_IS_OPEN',
			payload: true,
		})
	}

	// Components
	const RenderTabs = ({ list }) => {
		return (
			<div className="section-tab is-orange">
				<ul>
					{list.map(item => (
						<li className={activeSale && activeSale.id === item.id ? 'is-active' : ''} key={item.id}>
							<a href="#" onClick={e => {
								e.preventDefault();
								setActiveSale(item);
							}}>
								{(role === 'ADMIN') && (
									<div className="actions">
										<button className="edit" type="button" onClick={(e) => openUpdateSalesModal(e, item.id, item.name, item.firstAsset, item.secondAsset)}>
											<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
										</button>

										<button className="delete" type="button" onClick={(e) => openDeleteSalesModal(e, item.id)}>
											<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
										</button>
									</div>
								)}
								{(role === 'EDITOR') && (
									<div className="actions">
										<button className="edit" type="button" onClick={(e) => openUpdateSalesModal(e, item.id, item.name, item.firstAsset, item.secondAsset)}>
											<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
										</button>
									</div>
								)}
								{item.name}
							</a>
						</li>
					))}

					{(role === 'ADMIN' || role === 'EDITOR') && (
						<button className="add-new-button" type="button" style={{ marginLeft: 20 }} onClick={(e) => openCreateSalesModal(e)}>+</button>
					)}
				</ul>
			</div>
		);
	}

	const RenderFlags = () => {
		let firstAssetSrc = '';
		let secondAssetSrc = '';
		const planCreate = [
			{
				type: "green",
				label: "Plan",
			},
			{
				type: "green",
				label: "Create",
			},
			{
				type: "gray",
				label: "Qualify",
			},
			{
				type: "gray",
				label: "Develop",
			},
			{
				type: "gray",
				label: "Prove",
			},
			{
				type: "white",
				label: "Negotiate",
			},
			{
				type: "white",
				label: "Closing",
			},
		];
		const qualifyDevelopProve = [
			{
				type: "blue",
				label: "Plan",
			},
			{
				type: "blue",
				label: "Create",
			},
			{
				type: "green",
				label: "Qualify",
			},
			{
				type: "green",
				label: "Develop",
			},
			{
				type: "green",
				label: "Prove",
			},
			{
				type: "white",
				label: "Negotiate",
			},
			{
				type: "white",
				label: "Closing",
			},
		];
		const negotiateClosing = [
			{
				type: "blue",
				label: "Plan",
			},
			{
				type: "blue",
				label: "Create",
			},
			{
				type: "blue",
				label: "Qualify",
			},
			{
				type: "blue",
				label: "Develop",
			},
			{
				type: "blue",
				label: "Prove",
			},
			{
				type: "green",
				label: "Negotiate",
			},
			{
				type: "green",
				label: "Closing",
			},
		];
		const planCreateSales = [
			{
				type: "green",
				label: "In Progress",
				grow: 2,
			},
			{
				type: "white",
				label: "Proposal Sent",
				grow: 5,
			},
		];
		const qualifyClosingSales = [
			{
				type: "blue",
				label: "In Progress",
				grow: 2,
			},
			{
				type: "green",
				label: "Proposal Sent",
				grow: 5,
			},
		];
		if (activeSale) {
			if (activeSale.firstAsset === 'GREEN_GREEN') {
				firstAssetSrc = <ProcessBarWidget processBarItems={planCreate} />
			} else if (activeSale.firstAsset === 'BLUE_BLUE_GREEN_GREEN_GREEN') {
				firstAssetSrc = <ProcessBarWidget processBarItems={qualifyDevelopProve} />
			} else if (activeSale.firstAsset === 'BLUE_BLUE_BLUE_BLUE_BLUE_GREEN_GREEN') {
				firstAssetSrc = <ProcessBarWidget processBarItems={negotiateClosing} />
			}

			if (activeSale.secondAsset === 'GREEN') {
				secondAssetSrc = <ProcessBarWidget processBarItems={planCreateSales} />
			} else if (activeSale.secondAsset === 'BLUE_GREEN') {
				secondAssetSrc = <ProcessBarWidget processBarItems={qualifyClosingSales} />
			}
		}

		return (
			<>
				<div className="detail-item-flags-item">
					<h5>Direct Sales & Direct Touch</h5>
					{firstAssetSrc}
				</div>

				<div className="detail-item-flags-item">
					<h5>Indirect Sales Process</h5>
					{secondAssetSrc}
				</div>
			</>
		);
	}

	useEffect(() => {
		const list = activeSale?.cards;

		if (list) {
			setReOrderedList([...list].sort((a, b) => a.position - b.position));
		}
	}, [activeSale]);

	const RenderCards = ({ list }) => {
		if (!list) {
			return <p style={{ fontSize: 16 }}>Loading</p>;
		}

		if (list.length === 0) {
			return (
				<p style={{ fontSize: 16 }}>
					No card found.
					{` `}
					<a
						href="#"
						style={{ color: '#0a9bcd' }}
						onClick={(e) => openCreateSalesCardModal(e)}
					>
						Create One
					</a>
				</p>
			);
		}

		const reorder = (list, startIndex, endIndex) => {
			const result = Array.from(list);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);

			const newResult = result.map((i, key) => {
				return { ...i, position: key + 1 };
			});

			return newResult;
		};

		return (
			<DragDropContext onDragEnd={async (props) => {
				if (!props.destination) {
					return;
				}

				const list = reorder(
					reOrderedList,
					props.source.index,
					props.destination.index
				);

				const ids = [];

				list.map(item => {
					ids.push(item.id);
				});

				await changeCardPositions({
					variables: {
						ids,
					},
				});

				setReOrderedList(list);
			}}>
				<div className="detail-item-list">
					<Droppable droppableId={`droppable-${activeSale?.id}`}>
						{(provided, _) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{reOrderedList.map(({ id, title, content, fileArray }, i) => (
									<Draggable
										key={id}
										draggableId={`draggable-sale-${id}`}
										index={i}
									>
										{(provided, snapshot) => {
											if (role === 'ADMIN' || role === 'EDITOR') {
												return (
													<>
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
														>
															<Card variant="orange" title={title} key={id} style={{ marginBottom: 30 }}>
																{(role === 'ADMIN') && (
																	<div className="actions">
																		<button className="edit" type="button" onClick={(e) => openUpdateSalesCardModal(e, id, title, content, fileArray ? JSON.parse(fileArray) : [])}>
																			<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																		</button>

																		<button className="delete" type="button" onClick={(e) => openDeleteSalesCardModal(e, id)}>
																			<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																		</button>
																	</div>
																)}
																{(role === 'EDITOR') && (
																	<div className="actions">
																		<button className="edit" type="button" onClick={(e) => openUpdateSalesCardModal(e, id, title, content, fileArray ? JSON.parse(fileArray) : [])}>
																			<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																		</button>
																	</div>
																)}
																{htmlRender(content)}

																{fileArray && (
																	<>
																		<br /><br />

																		{JSON.parse(fileArray).map(file => (
																			<div className="item">
																				<div className="item-asset">
																					<a href={file.location} target="_blank">{file.name}</a>
																				</div>
																			</div>
																		))}
																	</>
																)}
															</Card>
														</div>
													</>
												);
											} else {
												return (
													<Card variant="orange" title={title} key={id} style={{ marginBottom: 30 }}>
														{(role === 'ADMIN' ) && (
															<div className="actions">
																<button className="edit" type="button" onClick={(e) => openUpdateSalesCardModal(e, id, title, content, fileArray ? JSON.parse(fileArray) : [])}>
																	<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																</button>

																<button className="delete" type="button" onClick={(e) => openDeleteSalesCardModal(e, id)}>
																	<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																</button>
															</div>
														)}
{(role === 'EDITOR') && (
															<div className="actions">
																<button className="edit" type="button" onClick={(e) => openUpdateSalesCardModal(e, id, title, content, fileArray ? JSON.parse(fileArray) : [])}>
																	<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																</button>

															</div>
														)}
														{htmlRender(content)}

														{fileArray && (
															<>
																<br /><br />

																{JSON.parse(fileArray).map(file => (
																	<div className="item">
																		<div className="item-asset">
																			<a href={file.location} target="_blank">{file.name}</a>
																		</div>
																	</div>
																))}
															</>
														)}
													</Card>
												);
											}
										}}
									</Draggable>
								))}

								{provided.placeholder}
							</div>
						)}
					</Droppable>

					{(role === 'ADMIN' || role === 'EDITOR') && (
						<button
							className="add-new-button"
							type="button"
							onClick={(e) => openCreateSalesCardModal(e)}
						>
							+
						</button>
					)}
				</div>
			</DragDropContext>
		);
	}

	const RenderModals = () => {
		return (
			<>
				<CreateSales industryId={industryId} />

				<UpdateSales
					industryId={industryId}
					id={selectedSalesId}
					name={selectedSalesName}
					firstAsset={selectedSalesFirstAsset}
					secondAsset={selectedSalesSecondAsset}
					onClose={() => {
						setSelectedSalesName('');
						setSelectedSalesFirstAsset('');
						setSelectedSalesSecondAsset('');
					}}
					onUpdate={(updatedSale) => {
						setActiveSale(updatedSale);
					}}
				/>

				<DeleteSales
					industryId={industryId}
					id={selectedSalesId}
					onDelete={() => {
						if (data.findSales.items.length > 0) {
							setActiveSale(data.findSales.items[0]);
						}
					}}
				/>

				<CreateSalesCard
					industryId={industryId}
					saleId={activeSale?.id}
					position={activeSale?.cards?.length ?? 0}
					onCreate={(card) => {
						setActiveSale({ ...activeSale, cards: [...activeSale.cards, card] });
					}}
				/>

				<UpdateSalesCard
					industryId={industryId}
					id={selectedSalesCardId}
					title={selectedSalesCardTitle}
					content={selectedSalesCardContent}
					selectedFiles={selectedSalesCardFiles}
					onClose={() => {
						setSelectedSalesCardId(null);
						setSelectedSalesCardTitle('');
						setSelectedSalesCardContent('');
						setSelectedSalesCardFiles(null);
					}}
					onUpdate={(card) => {
						const currentCardId = activeSale.cards.findIndex(({ id }) => id === card.id);
						const activeSaleCards = [...activeSale.cards];

						activeSaleCards[currentCardId] = card

						setActiveSale({
							...activeSale,
							cards: activeSaleCards,
						});
					}}
				/>

				<DeleteSalesCard
					id={selectedSalesCardId}
					industryId={industryId}
					saleId={activeSale?.id}
					onDelete={(card) => {
						setSelectedSalesCardId(null);
						const newCards = activeSale.cards.filter(item => item.id !== card.id);

						setActiveSale({ ...activeSale, cards: newCards });
					}}
				/>
			</>
		);
	}

	const Render = () => {
		if (loading) {
			return <p style={{ fontSize: 16 }}>Loading</p>;
		}

		const { findSales } = data;

		if (findSales.items.length === 0) {
			return (
				<p style={{ fontSize: 16 }}>
					No items found.

					{(role === 'ADMIN' || role === 'EDITOR') && (
						<>
							{` `}
							<a
								href="#"
								style={{ color: '#0a9bcd' }}
								onClick={(e) => openCreateSalesModal(e)}
							>
								Create One
							</a>
						</>
					)}
				</p>
			);
		}

		if (findSales.items.length === 1 || !activeSale) {
			useEffect(() => {
				setActiveSale(findSales.items[0]);
			}, []);
		}

		return (
			<>
				<RenderTabs list={findSales.items} />

				<RenderFlags />

				<RenderCards list={activeSale?.cards} />

			</>
		);
	}

	return (
		<>
			<Render />

			{(role === 'ADMIN' || role === 'EDITOR') && (
				<RenderModals />
			)}
		</>
	);
}

export default SalesList;