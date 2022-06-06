import { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import htmlRender from 'react-html-parser';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useDispatchGlobalState } from '../../global-state';
import { FIND_BUYER_CONTENTS_QUERY } from '../../../lib/queries';

import Card from '@/components/card';
import { useRouter } from 'next/router';
import BuyerContents from '.';
import CreateBuyerContent from './create';
import UpdateBuyerContent from './update';
import DeleteBuyerContent from './delete';

const CHANGE_CARD_POSITIONS_MUTATION = gql`
	mutation changeBuyerContentPositions($ids: [ID]!) {
		updateBuyerContentCardPositions(input: { ids: $ids }) {
			id
			position
		}
	}
`;

const BuyerContentList = ({ professionId, role }) => {
    const router = useRouter();

    	// State
	const [activeBuyerContent, setActiveBuyerContent] = useState(null);
	const [selectedBuyerContentId, setSelectedBuyerContentId] = useState(null);
	const [selectedBuyerContentName, setSelectedBuyerContentName] = useState(null);
	const [selectedBuyerContentTitle, setSelectedBuyerContentTitle] = useState('');
	const [selectedBuyerContentContent, setSelectedBuyerContentContent] = useState('');
	const [selectedBuyerContentFiles, setSelectedBuyerContentFiles] = useState(null);


	const [reOrderedList, setReOrderedList] = useState([]);

    	// Context
	const dispatch = useDispatchGlobalState();

	// GraphQL
	const { loading, data } = useQuery(
		FIND_BUYER_CONTENTS_QUERY,
		{
			variables: {
				professionId,
			},
		},
	);

	//Methods
	const openCreateBuyerContentModal = (e) => {
		e.preventDefault();

		dispatch({
			type: 'CREATE_BUYER_CONTENT_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openDeleteBuyerContentModal = (e, id) => {
		e.preventDefault();

		setSelectedBuyerContentId(id);

		dispatch({
			type: 'DELETE_BUYER_CONTENT_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openUpdateBuyerContentModal = (e, id, title, content, files) => {
		e.preventDefault();

		setSelectedBuyerContentId(id);
		setSelectedBuyerContentTitle(title);
		setSelectedBuyerContentContent(content);
		setSelectedBuyerContentFiles(files);

		dispatch({
			type: 'UPDATE_BUYER_CONTENT_MODAL_IS_OPEN',
			payload: true,
		})
	}

    //change card positions
    const [changeCardPositions] = useMutation(CHANGE_CARD_POSITIONS_MUTATION);

    useEffect(() => {
		if (data) {
			if (data.findBuyerContents.items.length > 0) {
				const list = data?.findBuyerContents.items;

				if (list) {
					setReOrderedList([...list].sort((a, b) => a.position - b.position));
				}
			}
		}
	},[data]);

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
						onClick={(e) => openCreateBuyerContentModal(e)}
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
					<Droppable droppableId={`droppable-contents`}>
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
															<Card variant="green" title={title} key={id} style={{ marginBottom: 30 }}>
																{(role === 'ADMIN') && (
																	<div className="actions">
																		<button className="edit" type="button" onClick={(e) => openUpdateBuyerContentModal(e, id, title, content, fileArray ? JSON.parse(fileArray) : [])}>
																			<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																		</button>

																		<button className="delete" type="button" onClick={(e) => openDeleteBuyerContentModal(e, id)}>
																			<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																		</button>
																	</div>
																)}
																{(role === 'EDITOR') && (
																	<div className="actions">
																		<button className="edit" type="button" onClick={(e) => openUpdateBuyerContentModal(e, id, title, content, fileArray ? JSON.parse(fileArray) : [])}>
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
													<Card variant="green" title={title} key={id} style={{ marginBottom: 30 }}>
														{(role === 'ADMIN' ) && (
															<div className="actions">
																<button className="edit" type="button" onClick={(e) => openUpdateBuyerContentModal(e, id, title, content, fileArray ? JSON.parse(fileArray) : [])}>
																	<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																</button>

																<button className="delete" type="button" onClick={(e) => openDeleteBuyerContentModal(e, id)}>
																	<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																</button>
															</div>
														)}
														{(role === 'EDITOR') && (
															<div className="actions">
																<button className="edit" type="button" onClick={(e) => openUpdateBuyerContentModal(e, id, title, content, fileArray ? JSON.parse(fileArray) : [])}>
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
							onClick={(e) => openCreateBuyerContentModal(e)}
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

				<CreateBuyerContent
					professionId={professionId}
					position={data?.findBuyerContents.items.length ?? 0}
					onCreate={(card) => {
						//setActiveSale({ ...activeSale, cards: [...activeSale.cards, card] });
					}}
				/>

				<DeleteBuyerContent
					professionId={professionId}
					id={selectedBuyerContentId}
					onDelete={() => {
					}}
				/>

				<UpdateBuyerContent
					professionId={professionId}
					id={selectedBuyerContentId}
					title={selectedBuyerContentTitle}
					content={selectedBuyerContentContent}
					selectedFiles={selectedBuyerContentFiles}
					onClose={() => {
						setSelectedBuyerContentId(null);
						setSelectedBuyerContentTitle('');
						setSelectedBuyerContentContent('');
						setSelectedBuyerContentFiles(null);
					}}
					onUpdate={(card) => {
						router.reload();
					}}
				/>
				
			</>
		);
	}

	const Render = () => {
		if (loading) {
			return <p style={{ fontSize: 16 }}>Loading</p>;
		}

		const { findBuyerContents } = data;

		if (findBuyerContents.items.length === 0) {
			return (
				<p style={{ fontSize: 16 }}>
					No items found.

					{(role === 'ADMIN' || role === 'EDITOR') && (
						<>
							{` `}
							<a
								href="#"
								style={{ color: '#0a9bcd' }}
								onClick={(e) => openCreateBuyerContentModal(e)}
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

				<RenderCards list={findBuyerContents} />

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
    )
}

export default BuyerContentList