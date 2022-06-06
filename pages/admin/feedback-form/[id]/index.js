import AdminSidebar from '@/components/admin/sidebar';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';

const GET_FEEDBACK_FORM_QUERY = gql`
	query getFeedbackFormSecond($id: ID!) {
		getFeedbackFormSecond(id: $id) {
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
			file
			fileName
		}
	}
`;

const AdminLanguages = () => {
	const router = useRouter();
	const { data, loading } = useQuery(
		GET_FEEDBACK_FORM_QUERY,
		{
			variables: {
				id: router.query.id ?? 0,
			}
		}
	);

	return (
		<main className="admin">
			<section className="admin">
				<div className="container">
					<div className="row">
						<AdminSidebar activeItem="feedback-form" />

						<div className="col-lg-10">
							<div className="admin-body">
								{loading ? <p>Loading...</p> : (
									<div className="admin-body-feedback-form-detail">
										<div className="admin-body-feedback-form-detail-item">
											<h2>Full Name</h2>

											<p>{data.getFeedbackFormSecond?.fullname}</p>
										</div>
										
										<div className="admin-body-feedback-form-detail-item">
											<h2>E-Mail</h2>

											<p>{data.getFeedbackFormSecond?.email}</p>
										</div>

										<div className="admin-body-feedback-form-detail-item">
											<h2>Industry</h2>

											<p>{data.getFeedbackFormSecond?.industry.name}</p>
										</div>

										<div className="admin-body-feedback-form-detail-item">
											<h2>Role</h2>

											<p>{data.getFeedbackFormSecond?.role.name}</p>
										</div>

										<div className="admin-body-feedback-form-detail-item">
											<h2>Area</h2>

											<p>{data.getFeedbackFormSecond?.area}</p>
										</div>

										<div className="admin-body-feedback-form-detail-item">
											<h2>Comments</h2>

											<p>{data.getFeedbackFormSecond?.comments}</p>
										</div>

										{data.getFeedbackFormSecond?.file && (
											<div className="admin-body-feedback-form-detail-item">
												<h2>File</h2>

												<a href={data.getFeedbackFormSecond?.file} target="_blank">{data.getFeedbackFormSecond?.fileName}</a>
											</div>
										)}
									</div>
								)}
								{/* {loading ? <p>Loading...</p> : (
									<div className="admin-body-feedback-form-detail">
									</div>
								)} */}
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default AdminLanguages;
