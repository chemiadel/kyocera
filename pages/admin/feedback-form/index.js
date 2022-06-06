import AdminSidebar from '@/components/admin/sidebar';
import { useState } from 'react';
import router from 'next/router';
import Modal from 'react-modal';
import { gql, useQuery } from '@apollo/client';

const FIND_FEEDBACK_FORM_QUERY = gql`
	query findFeedbackFormSeconds {
		findFeedbackFormSeconds(orderBy: { field: "id", order: DESC }) {
			items {
				id
				fullname
				email
				industry {
					id
					name
				}
				role {
					id
					name
				}
				area
				comments
			}
		}
	}
`;

const AdminLanguages = () => {
	const { data, loading } = useQuery(FIND_FEEDBACK_FORM_QUERY);

	return (
		<main className="admin">
			<section className="admin">
				<div className="container">
					<div className="row">
						<AdminSidebar activeItem="feedback-form" />

						<div className="col-lg-10">
							<div className="admin-body">
								<div className="table">
									<table>
										<thead>
											<tr>
												<th>Full Name</th>
												<th>E-Mail</th>
												<th>Industry</th>
												<th>Role</th>
												<th>Area</th>
												<th>Comments</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{loading ? <tr><td>Loading...</td><td /><td /><td /><td /><td /><td /></tr> : data.findFeedbackFormSeconds.items.map((item) => (
												<tr key={item.id}>
													<td style={{width: '15%'}}>{item.fullname}</td>
													<td>{item.email}</td>
													<td>{item.industry.name}</td>
													<td>{item.role.name}</td>
													<td>{item.area}</td>
													<td>{item.comments.substring(0, 20)}{item.comments.length >= 20 && '...'}</td>
													<td style={{width: '10%'}}>
														<div className="actions">
															<button className="edit" type="button" onClick={() => window.location.href = `/admin/feedback-form/${item.id}`}>
																<i>
																	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<g clip-path="url(#clip0)">
																			<path d="M10 2.49988C5.53033 2.49988 1.52515 5.43266 0.0334228 9.79798C-0.0111409 9.92921 -0.0111409 10.0708 0.0334228 10.202C1.52515 14.5674 5.53033 17.5001 10 17.5001C14.4697 17.5001 18.4749 14.5674 19.9666 10.202C20.0112 10.0708 20.0112 9.92921 19.9666 9.79798C18.4749 5.43266 14.4697 2.49988 10 2.49988V2.49988ZM10 16.2501C6.13401 16.2501 2.6592 13.747 1.2877 10C2.6592 6.25299 6.13397 3.74991 10 3.74991C13.866 3.74991 17.3408 6.25299 18.7123 10C17.3408 13.747 13.866 16.2501 10 16.2501V16.2501Z" fill="white"/>
																			<path d="M10 6.24994C7.93211 6.24994 6.24994 7.93211 6.24994 10C6.24994 12.0679 7.93211 13.7501 10 13.7501C12.0679 13.7501 13.7501 12.0679 13.7501 10C13.7501 7.93208 12.0679 6.24994 10 6.24994ZM10 12.5C8.62118 12.5 7.49998 11.3788 7.49998 10C7.49998 8.62118 8.62122 7.49998 10 7.49998C11.3788 7.49998 12.5 8.62122 12.5 10C12.5 11.3788 11.3788 12.5 10 12.5Z" fill="white"/>
																		</g>
																		<defs>
																			<clipPath id="clip0">
																				<rect width="20" height="20" fill="white"/>
																			</clipPath>
																		</defs>
																	</svg>
																</i>
															</button>
						
															{/* <button className="delete" type="button" onClick={() => {
																setSelectedItemKey(key);
																setSelectedItemId(lang._id);
																setDeleteModalIsOpen(true);
															}}>
																<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
															</button> */}
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
			</section>
		</main>
	);
}

export default AdminLanguages;
