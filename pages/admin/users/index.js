import AdminSidebar from '@/components/admin/sidebar';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { gql, useQuery, useMutation } from '@apollo/client';
import bcrypt from 'bcryptjs';

const FIND_USERS_QUERY = gql`
	query findUsers {
		findUsers(filter: { deleted: { ne: true } }) {
			items {
				id
				fullname
				email
				role
			}
		}
	}
`;

const DELETE_USER = gql`
	mutation deleteUser($id: ID!) {
		updateUser(input: { id: $id, deleted: true }) {
			id
			fullname
			email
			role
		}
	}
`;

const AdminLanguages = () => {
	const router = useRouter();
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
	const [selectedItemId, setSelectedItemId] = useState(null);

	const { data, loading } = useQuery(FIND_USERS_QUERY);

	const [deleteUser, state] = useMutation(DELETE_USER);

	const onDelete = async (e) => {
		e.preventDefault();
		
		await deleteUser({
			variables: {
				id: selectedItemId,
			}
		});

		router.reload();
	}

	return (
		<main className="admin">
			<section className="admin">
				<div className="container">
					<div className="row">
						<AdminSidebar activeItem="users" />

						<div className="col-lg-10">
							<div className="admin-body">
								<div className="table">
									<table>
										<thead>
											<tr>
												<th>Full Name</th>
												<th>E-mail</th>
												<th>Role</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{loading ? <tr><td>Loading...</td><td /><td /><td /></tr> : data.findUsers.items.map((user) => (
												<tr key={user.id}>
													<td>{user.fullname}</td>
													<td>{user.email}</td>
													<td>{user.role}</td>
													<td>
														<div className="actions">
															<button className="edit" type="button" onClick={() => window.location.href = `/admin/users/update/${user.id}`}>
																<i><svg height="20px" viewBox="0 0 512 511" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" /><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" /><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" /></svg></i>
															</button>
						
															<button className="delete" type="button" onClick={() => {
																setSelectedItemId(user.id);
																setDeleteModalIsOpen(true);
															}}>
																<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			
				<Modal
					isOpen={deleteModalIsOpen}
					onRequestClose={() => onCloseModal(setDeleteModalIsOpen)}
					style={{
						content: {
							top : '50%',
							left : '50%',
							right : 'auto',
							bottom : 'auto',
							marginRight : '-50%',
							transform: 'translate(-50%, -50%)',
							width: '60%',
							maxHeight: '60%',
							padding: '60px 40px',
						}
					}}
					contentLabel="Example Modal"
				>
					<div className="modal-content">
						<h2>Delete</h2>

						<form onSubmit={(e) => onDelete(e)}>
							<p>Do you want to delete this? Once you delete this, you will not able to undo this action.</p>

							<button type="submit" className="btn btn-danger">Delete</button>
							<button type="button" onClick={() => {
								setSelectedItemId(null);
								setDeleteModalIsOpen(false);
							}} className="btn btn-primary">Cancel</button>
						</form>
					</div>
				</Modal>
			</section>
		</main>
	);
}

export default AdminLanguages;
