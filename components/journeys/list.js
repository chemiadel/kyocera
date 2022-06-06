import { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import htmlRender from 'react-html-parser';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useDispatchGlobalState, useGlobalState } from '../global-state';
import { FIND_JOURNEYS_QUERY } from '../../lib/queries';

import CreateChallengeModal from './challenges/create';
import UpdateChallengeModal from './challenges/update';
import DeleteChallengeModal from './challenges/delete';

import CreatePainModal from './pains/create';
import UpdatePainModal from './pains/update';
import DeletePainModal from './pains/delete';

import CreateNeedModal from './needs/create';
import UpdateNeedModal from './needs/update';
import DeleteNeedModal from './needs/delete';

const CHANGE_CHALLENGE_POSITIONS_MUTATION = gql`
	mutation changeChallengePositions($ids: [ID]!) {
		updateChallengePositions(input: { ids: $ids }) {
			id
			position
		}
	}
`;

const CHANGE_PAIN_POSITIONS_MUTATION = gql`
	mutation changePainPositions($ids: [ID]!) {
		updatePainPositions(input: { ids: $ids }) {
			id
			position
		}
	}
`;

const CHANGE_NEED_POSITIONS_MUTATION = gql`
	mutation changeNeedPositions($ids: [ID]!) {
		updateNeedPositions(input: { ids: $ids }) {
			id
			position
		}
	}
`;

const JourneysList = ({ industryId, professionId, languageId, role }) => {
	const [activeTab, setActiveTab] = useState('challenges');
	const [activeChallange, setActiveChallange] = useState(null);
	const [activePain, setActivePain] = useState(null);
	const [activeNeed, setActiveNeed] = useState(null);

	const [selectedChallengeId, setSelectedChallengeId] = useState(null);
	const [selectedChallengeTitle, setSelectedChallengeTitle] = useState(null);
	const [selectedChallengeContent, setSelectedChallengeContent] = useState(null);
	const [selectedChallengeFiles, setSelectedChallengeFiles] = useState(null);

	const [selectedPainId, setSelectedPainId] = useState(null);
	const [selectedPainTitle, setSelectedPainTitle] = useState(null);
	const [selectedPainContent, setSelectedPainContent] = useState(null);
	const [selectedPainFiles, setSelectedPainFiles] = useState(null);

	const [selectedNeedId, setSelectedNeedId] = useState(null);
	const [selectedNeedTitle, setSelectedNeedTitle] = useState(null);
	const [selectedNeedContent, setSelectedNeedContent] = useState(null);
	const [selectedNeedFiles, setSelectedNeedFiles] = useState(null);

	const [reOrderedChallenges, setReOrderedChallenges] = useState([]);
	const [reOrderedPains, setReOrderedPains] = useState([]);
	const [reOrderedNeeds, setReOrderedNeeds] = useState([]);

	const state = useGlobalState();

	// Context
	const dispatch = useDispatchGlobalState();

	const { data, loading } = useQuery(
		FIND_JOURNEYS_QUERY,
		{
			variables: {
				industryId,
				professionId,
				languageId,
			}
		}
	);
	const [changeChallengePositions] = useMutation(CHANGE_CHALLENGE_POSITIONS_MUTATION);
	const [changePainPositions] = useMutation(CHANGE_PAIN_POSITIONS_MUTATION);
	const [changeNeedPositions] = useMutation(CHANGE_NEED_POSITIONS_MUTATION);

	const openCreateChallengeCardModal = (e) => {
		e.preventDefault();

		dispatch({
			type: 'CREATE_CHALLENGE_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openUpdateChallengeModal = (e, id, title, content, files) => {
		e.preventDefault();

		setSelectedChallengeId(id);
		setSelectedChallengeTitle(title);
		setSelectedChallengeContent(content);
		setSelectedChallengeFiles(files);

		dispatch({
			type: 'UPDATE_CHALLENGE_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openDeleteChallengeModal = (e, id) => {
		e.preventDefault();

		setSelectedChallengeId(id);

		dispatch({
			type: 'DELETE_CHALLENGE_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openCreatePainModal = (e) => {
		e.preventDefault();

		dispatch({
			type: 'CREATE_PAIN_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openUpdatePainModal = (e, id, title, content, files) => {
		e.preventDefault();

		setSelectedPainId(id);
		setSelectedPainTitle(title);
		setSelectedPainContent(content);
		setSelectedPainFiles(files);

		dispatch({
			type: 'UPDATE_PAIN_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openDeletePainModal = (e, id) => {
		e.preventDefault();

		setSelectedPainId(id);

		dispatch({
			type: 'DELETE_PAIN_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openCreateNeedModal = (e) => {
		e.preventDefault();

		dispatch({
			type: 'CREATE_NEED_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openUpdateNeedModal = (e, id, title, content, files) => {
		e.preventDefault();

		setSelectedNeedId(id);
		setSelectedNeedTitle(title);
		setSelectedNeedContent(content);
		setSelectedNeedFiles(files);

		dispatch({
			type: 'UPDATE_NEED_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const openDeleteNeedModal = (e, id) => {
		e.preventDefault();

		setSelectedNeedId(id);

		dispatch({
			type: 'DELETE_NEED_MODAL_IS_OPEN',
			payload: true,
		})
	}

	const RenderTabs = () => {
		return (
			<div className="section-tab">
				<ul>
					<li className={activeTab === 'challenges' ? 'is-active' : ''}>
						<a href="#" onClick={(e) => {
							e.preventDefault();

							setActiveChallange(null);
							setActivePain(null);
							setActiveNeed(null);
							setActiveTab('challenges');
						}}>
							Challenges
						</a>
					</li>

					<li className={activeTab === 'pains' ? 'is-active is-pain' : ''}>
						<a href="#" onClick={(e) => {
							e.preventDefault();

							setActiveChallange(null);
							setActivePain(null);
							setActiveNeed(null);
							setActiveTab('pains');
						}}>
							Pains
						</a>
					</li>

					<li className={activeTab === 'needs' ? 'is-active is-need' : ''}>
						<a href="#" onClick={(e) => {
							e.preventDefault();

							setActiveChallange(null);
							setActivePain(null);
							setActiveNeed(null);
							setActiveTab('needs');
						}}>
							Needs
						</a>
					</li>
				</ul>
			</div>
		);
	}

	useEffect(() => {
		if (data) {
			if (data.findIndustries.items.length > 0) {
				if (data.findIndustries.items[0].professions.length > 0) {
					const challenges = data.findIndustries.items[0].professions[0].challenges;

					setReOrderedChallenges([...challenges].sort((a, b) => a.position - b.position));

					if (activeChallange) {
						const challenge = challenges.find(item => item.id === activeChallange);

						if (challenge) {
							setReOrderedPains([...challenge.pains].sort((a, b) => a.position - b.position));
						}
					} else {
						setReOrderedPains([]);
					}

					if (activePain) {
						const challenge = challenges.find(item => item.id === activeChallange);

						if (challenge && challenge.pains) {
							const pain = challenge.pains.find(item => item.id === activePain);

							if (pain) {
								setReOrderedNeeds([...pain.needs].sort((a, b) => a.position - b.position));
							}
						}
					} else {
						setReOrderedNeeds([]);
					}
				}
			}
		}
	}, [data]);

	useEffect(() => {
		if (activeChallange) {
			const challenge = reOrderedChallenges.find(item => item.id === activeChallange);

			if (challenge) {
				setReOrderedPains([...challenge.pains].sort((a, b) => a.position - b.position));
			}
		} else {
			setReOrderedPains([]);
		}
	}, [activeChallange]);

	useEffect(() => {
		if (activePain) {
			const pain = reOrderedPains.find(item => item.id === activePain);

			if (pain) {
				setReOrderedNeeds([...pain.needs].sort((a, b) => a.position - b.position));
			}
		} else {
			setReOrderedNeeds([]);
		}
	}, [activePain]);

	const RenderChallenges = () => {
		const reorder = (list, startIndex, endIndex) => {
			const result = Array.from(list);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);

			const newResult = result.map((i, key) => {
				return { ...i, position: key + 1 };
			});

			return newResult;
		};

		const RenderPainCards = () => {
			return (
				<div className="detail-item-list-journey-card-body-cards is-pain">
					<div className="detail-item-list-journey-card-body-cards-title">Pain</div>

					<DragDropContext onDragEnd={async (props) => {
						if (!props.destination) {
							return;
						}

						const list = reorder(
							reOrderedPains,
							props.source.index,
							props.destination.index
						);

						const ids = [];

						list.map(item => {
							ids.push(item.id);
						});

						await changePainPositions({
							variables: {
								ids,
							},
						});

						setReOrderedPains(list);
					}}>
						<div className="detail-item-list-journey-card-body-cards-body">
							{reOrderedPains.length === 0 ? (
								<p style={{ fontSize: 16, }}>
									No pain found.

									{(role === 'ADMIN' || role === 'EDITOR') && (
										<>
											{` `}
											<a
												href="#"
												style={{ color: '#0a9bcd' }}
												onClick={(e) => openCreatePainModal(e)}
											>
												Create One
											</a>
										</>
									)}
								</p>
							) : (
								<>
									<Droppable droppableId={`droppable-pains`}>
										{(provided) => (
											<div ref={provided.innerRef} {...provided.droppableProps}>
												{reOrderedPains.map((pain, i) => (
													<Draggable
														key={pain.id}
														draggableId={`draggable-pain-${pain.id}`}
														index={i}
													>
														{(provided) => {
															if (role === 'ADMIN' || role === 'EDITOR') {
																return (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																	>
																		<div className="detail-item-list-journey-card-body-cards-body-item" style={{ marginBottom: 30 }} key={pain.id}>
																			<div className="detail-item-list-journey-card-body-cards-body-item-content">
																				<div
																					className="detail-item-list-journey-card-body-cards-body-item-head"
																					{...provided.dragHandleProps}
																					onClick={() => {
																						if (activePain === pain.id) {
																							setActivePain(null);
																						} else {
																							setActivePain(pain.id);
																						}
																					}}
																				>
																					<div className="detail-item-list-journey-card-body-cards-body-item-head-label">
																						PAIN
																					</div>
																					<div className="detail-item-list-journey-card-body-cards-body-item-head-title">
																						{pain.title}
																					</div>
																				</div>

																				{activePain === pain.id && (
																					<div className="detail-item-list-journey-card-body-cards-body-item-body">
																						<div className="detail-item-list-journey-card-body-cards-body-item-body-description">
																							{htmlRender(pain.content)}
																						</div>

																						{pain.fileArray && JSON.parse(pain.fileArray).map(file => (
																							<div className="item">
																								<div className="item-asset">
																									<a href={file.location} target="_blank">{file.name}</a>
																								</div>
																							</div>
																						))}

																						<RenderNeedCards />

																						{(role === 'ADMIN') && (
																							<div className="actions">
																								<button className="edit" type="button" onClick={(e) => openUpdatePainModal(e, pain.id, pain.title, pain.content, pain.fileArray ? JSON.parse(pain.fileArray) : [])}>
																									<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																								</button>

																								<button className="delete" type="button" onClick={(e) => openDeletePainModal(e, pain.id)}>
																									<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																								</button>
																							</div>
																						)}
																						
																						{(role === 'EDITOR') && (
																						<div className="actions">
																								<button className="edit" type="button" onClick={(e) => openUpdatePainModal(e, pain.id, pain.title, pain.content, pain.fileArray ? JSON.parse(pain.fileArray) : [])}>
																									<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																								</button>
																							</div>
																						)}
																					</div>
																				)}
																			</div>

																			<div
																				className={`detail-item-list-journey-card-body-cards-body-item-icon ${activePain === pain.id ? 'is-rotate' : ''}`}
																				onClick={() => {
																					if (activePain === pain.id) {
																						setActivePain(null);
																					} else {
																						setActivePain(pain.id);
																					}
																				}}
																			>
																				<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119"><g transform="translate(39.98) rotate(90)"><path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"></path></g></svg>
																			</div>
																		</div>
																	</div>
																);
															} else {
																return (
																	<div className="detail-item-list-journey-card-body-cards-body-item" style={{ marginBottom: 30 }} key={pain.id}>
																		<div className="detail-item-list-journey-card-body-cards-body-item-content">
																			<div
																				className="detail-item-list-journey-card-body-cards-body-item-head"
																				{...provided.dragHandleProps}
																				onClick={() => {
																					if (activePain === pain.id) {
																						setActivePain(null);
																					} else {
																						setActivePain(pain.id);
																					}
																				}}
																			>
																				<div className="detail-item-list-journey-card-body-cards-body-item-head-label">
																					PAIN
																				</div>
																				<div className="detail-item-list-journey-card-body-cards-body-item-head-title">
																					{pain.title}
																				</div>
																			</div>

																			{activePain === pain.id && (
																				<div className="detail-item-list-journey-card-body-cards-body-item-body">
																					<div className="detail-item-list-journey-card-body-cards-body-item-body-description">
																						{htmlRender(pain.content)}
																					</div>

																					{pain.fileArray && JSON.parse(pain.fileArray).map(file => (
																						<div className="item">
																							<div className="item-asset">
																								<a href={file.location} target="_blank">{file.name}</a>
																							</div>
																						</div>
																					))}

																					<RenderNeedCards />

																					{(role === 'ADMIN') && (
																						<div className="actions">
																							<button className="edit" type="button" onClick={(e) => openUpdatePainModal(e, pain.id, pain.title, pain.content)}>
																								<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																							</button>

																							<button className="delete" type="button" onClick={(e) => openDeletePainModal(e, pain.id)}>
																								<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																							</button>
																						</div>
																					)}
																					{(role === 'EDITOR') && (
																						<div className="actions">
																							<button className="edit" type="button" onClick={(e) => openUpdatePainModal(e, pain.id, pain.title, pain.content)}>
																								<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																							</button>
																						</div>
																					)}
																				</div>
																			)}
																		</div>

																		<div
																			className={`detail-item-list-journey-card-body-cards-body-item-icon ${activePain === pain.id ? 'is-rotate' : ''}`}
																			onClick={() => {
																				if (activePain === pain.id) {
																					setActivePain(null);
																				} else {
																					setActivePain(pain.id);
																				}
																			}}
																		>
																			<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119"><g transform="translate(39.98) rotate(90)"><path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"></path></g></svg>
																		</div>
																	</div>
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
											onClick={(e) => openCreatePainModal(e)}
										>
											+
										</button>
									)}
								</>
							)}
						</div>
					</DragDropContext>
				</div>
			);
		}

		const RenderNeedCards = () => {
			return (
				<div className="detail-item-list-journey-card-body-cards is-need">
					<div className="detail-item-list-journey-card-body-cards-title">Need</div>
					<DragDropContext onDragEnd={async (props) => {
						if (!props.destination) {
							return;
						}

						const list = reorder(
							reOrderedNeeds,
							props.source.index,
							props.destination.index
						);

						const ids = [];

						list.map(item => {
							ids.push(item.id);
						});

						await changeNeedPositions({
							variables: {
								ids,
							},
						});

						setReOrderedNeeds(list);
					}}>
						<div className="detail-item-list-journey-card-body-cards-body">
							{reOrderedNeeds.length === 0 ? (
								<p style={{ fontSize: 16, }}>
									No need found.

									{(role === 'ADMIN' || role === 'EDITOR') && (
										<>
											{` `}
											<a
												href="#"
												style={{ color: '#0a9bcd' }}
												onClick={(e) => openCreateNeedModal(e)}
											>
												Create One
											</a>
										</>
									)}
								</p>
							) : (
								<>
									<Droppable droppableId={`droppable-needs`}>
										{provided => (
											<div ref={provided.innerRef} {...provided.droppableProps}>
												{reOrderedNeeds.map((need, i) => (
													<Draggable
														key={need.id}
														draggableId={`draggable-needs-${need.id}`}
														index={i}
													>
														{provided => {
															if (role === 'ADMIN' || role === 'EDITOR') {
																return (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																	>
																		<div className="detail-item-list-journey-card-body-cards-body-item" style={{ marginBottom: 20 }} key={need.id}>
																			<div className="detail-item-list-journey-card-body-cards-body-item-content">
																				<div
																					className="detail-item-list-journey-card-body-cards-body-item-head"
																					{...provided.dragHandleProps}
																					onClick={() => {
																						if (activeNeed === need.id) {
																							setActiveNeed(null);
																						} else {
																							setActiveNeed(need.id);
																						}
																					}}
																				>
																					<div className="detail-item-list-journey-card-body-cards-body-item-head-label">
																						NEED
																					</div>
																					<div className="detail-item-list-journey-card-body-cards-body-item-head-title">
																						{need.title}
																					</div>
																				</div>

																				{activeNeed === need.id && (
																					<div className="detail-item-list-journey-card-body-cards-body-item-body">
																						<div className="detail-item-list-journey-card-body-cards-body-item-body-description">
																							{htmlRender(need.content)}
																						</div>

																						{need.fileArray && JSON.parse(need.fileArray).map(file => (
																							<div className="item">
																								<div className="item-asset">
																									<a href={file.location} target="_blank">{file.name}</a>
																								</div>
																							</div>
																						))}

																						{(role === 'ADMIN') && (
																							<div className="actions">
																								<button className="edit" type="button" onClick={(e) => openUpdateNeedModal(e, need.id, need.title, need.content, need.fileArray ? JSON.parse(need.fileArray) : [])}>
																									<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																								</button>

																								<button className="delete" type="button" onClick={(e) => openDeleteNeedModal(e, need.id)}>
																									<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																								</button>
																							</div>
																						)}
																						{(role === 'EDITOR') && (
																							<div className="actions">
																								<button className="edit" type="button" onClick={(e) => openUpdateNeedModal(e, need.id, need.title, need.content, need.fileArray ? JSON.parse(need.fileArray) : [])}>
																									<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																								</button>
																							</div>
																						)}
																					</div>
																				)}
																			</div>

																			<div
																				className={`detail-item-list-journey-card-body-cards-body-item-icon ${activeNeed === need.id ? 'is-rotate' : ''}`}
																				onClick={() => {
																					if (activeNeed === need.id) {
																						setActiveNeed(null);
																					} else {
																						setActiveNeed(need.id);
																					}
																				}}
																			>
																				<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119"><g transform="translate(39.98) rotate(90)"><path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"></path></g></svg>
																			</div>
																		</div>
																	</div>
																);
															} else {
																return (
																	<div className="detail-item-list-journey-card-body-cards-body-item" style={{ marginBottom: 20 }} key={need.id}>
																		<div className="detail-item-list-journey-card-body-cards-body-item-content">
																			<div
																				className="detail-item-list-journey-card-body-cards-body-item-head"
																				{...provided.dragHandleProps}
																				onClick={() => {
																					if (activeNeed === need.id) {
																						setActiveNeed(null);
																					} else {
																						setActiveNeed(need.id);
																					}
																				}}
																			>
																				<div className="detail-item-list-journey-card-body-cards-body-item-head-label">
																					NEED
																				</div>
																				<div className="detail-item-list-journey-card-body-cards-body-item-head-title">
																					{need.title}
																				</div>
																			</div>

																			{activeNeed === need.id && (
																				<div className="detail-item-list-journey-card-body-cards-body-item-body">
																					<div className="detail-item-list-journey-card-body-cards-body-item-body-description">
																						{htmlRender(need.content)}
																					</div>

																					{need.fileArray && JSON.parse(need.fileArray).map(file => (
																						<div className="item">
																							<div className="item-asset">
																								<a href={file.location} target="_blank">{file.name}</a>
																							</div>
																						</div>
																					))}

																					{(role === 'ADMIN' ) && (
																						<div className="actions">
																							<button className="edit" type="button" onClick={(e) => openUpdateNeedModal(e, need.id, need.title, need.content)}>
																								<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																							</button>

																							<button className="delete" type="button" onClick={(e) => openDeleteNeedModal(e, need.id)}>
																								<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																							</button>
																						</div>
																					)}

																					{(role === 'EDITOR') && (
																						<div className="actions">
																							<button className="edit" type="button" onClick={(e) => openUpdateNeedModal(e, need.id, need.title, need.content)}>
																								<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																							</button>
																						</div>
																					)}
																				</div>
																			)}
																		</div>

																		<div
																			className={`detail-item-list-journey-card-body-cards-body-item-icon ${activeNeed === need.id ? 'is-rotate' : ''}`}
																			onClick={() => {
																				if (activeNeed === need.id) {
																					setActiveNeed(null);
																				} else {
																					setActiveNeed(need.id);
																				}
																			}}
																		>
																			<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119"><g transform="translate(39.98) rotate(90)"><path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"></path></g></svg>
																		</div>
																	</div>
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
											onClick={(e) => openCreateNeedModal(e)}
										>
											+
										</button>
									)}
								</>
							)}
						</div>
					</DragDropContext>
				</div>
			);
		}

		return (
			<DragDropContext onDragEnd={async (props) => {
				if (!props.destination) {
					return;
				}

				const list = reorder(
					reOrderedChallenges,
					props.source.index,
					props.destination.index
				);

				const ids = [];

				list.map(item => {
					ids.push(item.id);
				});

				await changeChallengePositions({
					variables: {
						ids,
					},
				});

				setReOrderedChallenges(list);
			}}>
				<div className="detail-item-list">
					<Droppable droppableId={`droppable-challenge`}>
						{(provided, _) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{reOrderedChallenges.map((journey, i) => (
									<Draggable
										key={journey.id}
										draggableId={`draggable-challenge-${journey.id}`}
										index={i}
									>
										{(provided) => {
											if (role === 'ADMIN' || role === 'EDITOR') {
												return (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
													>
														<div className="detail-item-list-journey-card" style={{ marginBottom: 30 }} key={journey.id}>
															<div className="detail-item-list-journey-card-content">
																{(!activeChallange || activeChallange !== journey.id) && (
																	<div
																		className="detail-item-list-journey-card-head"
																		{...provided.dragHandleProps}
																		onClick={() => {
																			if (activeChallange === journey.id) {
																				setActiveChallange(null);
																			} else {
																				setActiveChallange(journey.id);
																			}
																		}}
																	>
																		<div className="detail-item-list-journey-card-head-title">
																			{journey.title}
																		</div>
																	</div>
																)}
																{activeChallange === journey.id && (
																	<div className="detail-item-list-journey-card-body">
																		<div
																			className="detail-item-list-journey-card-body-title"
																			{...provided.dragHandleProps}
																			onClick={() => {
																				setActiveChallange(null);
																			}}
																		>
																			Challenge
																		</div>

																		<div className="detail-item-list-journey-card-body-description">{htmlRender(journey.content)}</div>

																		{journey.fileArray && JSON.parse(journey.fileArray).map(file => (
																			<div className="item">
																				<div className="item-asset">
																					<a href={file.location} target="_blank">{file.name}</a>
																				</div>
																			</div>
																		))}

																		<RenderPainCards items={journey.pains} />

																		{(role === 'ADMIN') && (
																			<div className="actions">
																				<button className="edit" type="button" onClick={(e) => openUpdateChallengeModal(e, journey.id, journey.title, journey.content, journey.fileArray ? JSON.parse(journey.fileArray) : [])}>
																					<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																				</button>

																				<button className="delete" type="button" onClick={(e) => openDeleteChallengeModal(e, journey.id)}>
																					<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																				</button>
																			</div>
																		)}
																		{(role === 'EDITOR') && (
																			<div className="actions">
																				<button className="edit" type="button" onClick={(e) => openUpdateChallengeModal(e, journey.id, journey.title, journey.content, journey.fileArray ? JSON.parse(journey.fileArray) : [])}>
																					<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																				</button>
																			</div>
																		)}
																	</div>
																)}
															</div>

															<div
																className={`detail-item-list-journey-card-icon ${activeChallange === journey.id ? 'is-rotate' : ''}`}
																onClick={() => {
																	if (activeChallange === journey.id) {
																		setActiveChallange(null);
																	} else {
																		setActiveChallange(journey.id);
																	}
																}}
															>
																<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119"><g transform="translate(39.98) rotate(90)"><path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"></path></g></svg>
															</div>
														</div>
													</div>
												);
											} else {
												return (
													<div className="detail-item-list-journey-card" style={{ marginBottom: 30 }} key={journey.id}>
														<div className="detail-item-list-journey-card-content">
															{(!activeChallange || activeChallange !== journey.id) && (
																<div
																	className="detail-item-list-journey-card-head"
																	{...provided.dragHandleProps}
																	onClick={() => {
																		if (activeChallange === journey.id) {
																			setActiveChallange(null);
																		} else {
																			setActiveChallange(journey.id);
																		}
																	}}
																>
																	<div className="detail-item-list-journey-card-head-title">
																		{journey.title}
																	</div>
																</div>
															)}
															{activeChallange === journey.id && (
																<div className="detail-item-list-journey-card-body">
																	<div
																		className="detail-item-list-journey-card-body-title"
																		{...provided.dragHandleProps}
																		onClick={() => {
																			setActiveChallange(null);
																		}}
																	>
																		Challenge
																	</div>

																	<div className="detail-item-list-journey-card-body-description">{htmlRender(journey.content)}</div>

																	{journey.fileArray && JSON.parse(journey.fileArray).map(file => (
																		<div className="item">
																			<div className="item-asset">
																				<a href={file.location} target="_blank">{file.name}</a>
																			</div>
																		</div>
																	))}

																	<RenderPainCards items={journey.pains} />

																	{(role === 'ADMIN' ) && (
																		<div className="actions">
																			<button className="edit" type="button" onClick={(e) => openUpdateChallengeModal(e, journey.id, journey.title, journey.content)}>
																				<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																			</button>

																			<button className="delete" type="button" onClick={(e) => openDeleteChallengeModal(e, journey.id)}>
																				<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
																			</button>
																		</div>
																	)}
																	{(role === 'EDITOR') && (
																		<div className="actions">
																			<button className="edit" type="button" onClick={(e) => openUpdateChallengeModal(e, journey.id, journey.title, journey.content)}>
																				<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
																			</button>
																		</div>
																	)}
																</div>
															)}
														</div>

														<div
															className={`detail-item-list-journey-card-icon ${activeChallange === journey.id ? 'is-rotate' : ''}`}
															onClick={() => {
																if (activeChallange === journey.id) {
																	setActiveChallange(null);
																} else {
																	setActiveChallange(journey.id);
																}
															}}
														>
															<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119"><g transform="translate(39.98) rotate(90)"><path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"></path></g></svg>
														</div>
													</div>
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
							onClick={(e) => openCreateChallengeCardModal(e)}
						>
							+
						</button>
					)}
				</div>
			</DragDropContext>
		);
	}

	const RenderPains = ({ list }) => {
		return (
			<div className="detail-item-list">
				{list.map(journey => (
					<div className="detail-item-list-journey-card-body-cards-body">
						{journey.pains.map(pain => (
							<div className="detail-item-list-journey-card-body-cards-body-item" style={{ marginBottom: 30 }} key={pain.id}>
								<div className="detail-item-list-journey-card-body-cards-body-item-content">
									<div
										className="detail-item-list-journey-card-body-cards-body-item-head"
										onClick={() => {
											setActiveChallange(journey.id);

											setTimeout(() => {
												setActivePain(pain.id);

												setTimeout(() => {
													setActiveTab('challenges');
												}, 150);
											}, 150);
										}}
									>
										<div className="detail-item-list-journey-card-body-cards-body-item-head-title">
											{pain.title}
										</div>
										<div className="detail-item-list-journey-card-body-cards-body-item-icon" style={{ backgroundColor: '#F5B400' }}>
											<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119"><g transform="translate(39.98) rotate(90)"><path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"></path></g></svg>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				))}
			</div>
		);
	}

	const RenderNeeds = ({ list }) => {
		return (
			<div className="detail-item-list">
				{list.map(journey => (
					<>
						{journey.pains.map(pain => (
							<>
								{pain.needs.map(need => (
									<div className="detail-item-list-journey-card-body-cards-body-item" style={{ marginBottom: 20 }} key={need.id}>
										<div className="detail-item-list-journey-card-body-cards-body-item-content">
											<div
												className="detail-item-list-journey-card-body-cards-body-item-head"
												onClick={() => {
													setActiveChallange(journey.id);

													setTimeout(() => {
														setActivePain(pain.id);

														setTimeout(() => {
															setActiveNeed(need.id);

															setTimeout(() => {
																setActiveTab('challenges');
															}, 150);
														}, 150);
													}, 150);
												}}
											>
												<div className="detail-item-list-journey-card-body-cards-body-item-head-title">
													{need.title}
												</div>
												<div className="detail-item-list-journey-card-body-cards-body-item-icon" style={{ backgroundColor: '#F06400' }}>
													<svg xmlns="http://www.w3.org/2000/svg" width="39.98" height="21.119" viewBox="0 0 39.98 21.119"><g transform="translate(39.98) rotate(90)"><path d="M20.793,19.193,1.933.333a1.132,1.132,0,0,0-1.6,1.6L18.389,19.989.333,38.045a1.128,1.128,0,0,0,0,1.6,1.138,1.138,0,0,0,.8.335,1.1,1.1,0,0,0,.8-.335l18.86-18.86A1.125,1.125,0,0,0,20.793,19.193Z" transform="translate(0 0)" fill="#fff"></path></g></svg>
												</div>
											</div>
										</div>
									</div>
								))}
							</>
						))}
					</>
				))}
			</div>
		);
	}

	const RenderContent = ({ list }) => {
		if (activeTab === 'challenges') {
			return <RenderChallenges list={list} />
		}

		if (activeTab === 'pains') {
			return <RenderPains list={list} />
		}

		if (activeTab === 'needs') {
			return <RenderNeeds list={list} />
		}
	}

	const Render = () => {
		if (loading) {
			return <p style={{ fontSize: 16, }}>Loading...</p>
		}

		const { challenges } = data.findIndustries.items[0].professions[0];

		if (challenges.length === 0) {
			return (
				<p style={{ fontSize: 16, }}>
					No challenge found.

					{(role === 'ADMIN' || role === 'EDITOR') && (
						<>
							{` `}
							<a
								href="#"
								style={{ color: '#0a9bcd' }}
								onClick={(e) => {
									openCreateChallengeCardModal(e);
								}}
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
				<RenderTabs />

				<RenderContent
					list={challenges}
				/>
			</>
		);
	}


	const RenderModals = () => {
		return (
			<>
				<CreateChallengeModal
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
					position={data?.findIndustries.items[0].professions[0].challenges.length}
				/>
				<CreatePainModal
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
					challengeId={activeChallange}
					position={0}
				/>
				<CreateNeedModal
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
					painId={activePain}
					position={0}
				/>

				<UpdateChallengeModal
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
					id={selectedChallengeId}
					title={selectedChallengeTitle}
					content={selectedChallengeContent}
					selectedFiles={selectedChallengeFiles}
					onClose={() => {
						setSelectedChallengeId(null);
						setSelectedChallengeTitle('');
						setSelectedChallengeContent('');
						setSelectedChallengeFiles(null);
					}}
				/>
				<UpdatePainModal
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
					id={selectedPainId}
					title={selectedPainTitle}
					content={selectedPainContent}
					selectedFiles={selectedPainFiles}
					onClose={() => {
						setSelectedPainId(null);
						setSelectedPainTitle('');
						setSelectedPainContent('');
						setSelectedPainFiles(null);
					}}
				/>
				<UpdateNeedModal
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
					id={selectedNeedId}
					title={selectedNeedTitle}
					content={selectedNeedContent}
					selectedFiles={selectedNeedFiles}
					onClose={() => {
						setSelectedNeedId(null);
						setSelectedNeedTitle('');
						setSelectedNeedContent('');
						setSelectedNeedFiles(null);
					}}
				/>

				<DeleteChallengeModal
					id={selectedChallengeId}
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
				/>
				<DeletePainModal
					id={selectedPainId}
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
				/>
				<DeleteNeedModal
					id={selectedNeedId}
					industryId={industryId}
					professionId={professionId}
					languageId={languageId}
				/>
			</>
		);
	}

	return (
		<>
			<Render />


			<RenderModals />
		</>
	);
}

export default JourneysList;