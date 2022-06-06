import AdminSidebar from '@/components/admin/sidebar';

const AdminHome = () => {
	return (
		<main className="admin">
			<section className="admin">
				<div className="container">
					<div className="row">
						<AdminSidebar activeItem="dashboard" />

						<div className="col-lg-10">
							<div className="admin-body">
								<p>Welcome!</p>
								{/* <div className="row">
									<div className="col-lg-6">
										<div className="admin-card">
											<h4>Total Users</h4>

											<p>11.685</p>
										</div>
									</div>

									<div className="col-lg-6">
										<div className="admin-card">
											<h4>Total Journeys</h4>

											<p>500</p>
										</div>
									</div>

									<div className="col-lg-6">
										<div className="admin-card">
											<h4>Total Sales Processes</h4>

											<p>50</p>
										</div>
									</div>

									<div className="col-lg-6">
										<div className="admin-card">
											<h4>Total Customer Cases and Competitions</h4>

											<p>100</p>
										</div>
									</div>
								</div>
							 */}
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default AdminHome;
