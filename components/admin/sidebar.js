import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {clearLocalStorage} from "../../lib/helpers/localstorage.helper";

const AdminSidebar = ({ activeItem }) => {
	const router = useRouter();
	const [sidebarDropdownActiveItem, setSidebarDropdownActiveItem] = useState(activeItem || 'dashboard');
	const openSidebarDropdown = item => {
		return sidebarDropdownActiveItem === item ? setSidebarDropdownActiveItem('') : setSidebarDropdownActiveItem(item);
	}

	return (
		<div className="col-lg-2">
			<div className="admin-sidebar">
				<ul>
					<li>
						<div className="admin-sidebar-item">
							<button type="button" onClick={() => router.back()}>Go Back</button>
						</div>
					</li>

					<li>
						<div className="admin-sidebar-item">
							<button type="button" className={sidebarDropdownActiveItem === 'dashboard' ? 'is-active' : ''} onClick={() => router.push('/admin')}>Dashboard</button>
						</div>
					</li>

					<li>
						<div className="admin-sidebar-item">
							<button className={sidebarDropdownActiveItem === 'feedback-form' ? 'is-active' : ''} onClick={() => {
								router.push('/admin/feedback-form')
							}}>Feedback Form</button>
						</div>
					</li>

					<li>
						<div className="admin-sidebar-item">
							<button type="button" className={sidebarDropdownActiveItem === 'users' ? 'is-active' : ''} onClick={() => openSidebarDropdown('users')}>Users</button>

							{sidebarDropdownActiveItem === 'users' && (
								<div className="admin-sidebar-item-dropdown">
									<ul>
										<li>
											<Link href="/admin/users">
												<a>List</a>
											</Link>
										</li>

										<li>
											<Link href="/admin/users/create">
												<a>Create</a>
											</Link>
										</li>
									</ul>
								</div>
							)}
						</div>
					</li>

					<li>
						<div className="admin-sidebar-item">
							<button type="button" className={sidebarDropdownActiveItem === 'tenants' ? 'is-active' : ''} onClick={() => openSidebarDropdown('tenants')}>AD Tenants</button>

							{sidebarDropdownActiveItem === 'tenants' && (
								<div className="admin-sidebar-item-dropdown">
									<ul>
										<li>
											<Link href="/admin/tenants">
												<a>List</a>
											</Link>
										</li>

										<li>
											<Link href="/admin/tenants/create">
												<a>Create</a>
											</Link>
										</li>
									</ul>
								</div>
							)}
						</div>
					</li>

					<li>
						<div className="admin-sidebar-item">
							<button type="button" className={sidebarDropdownActiveItem === 'languages' ? 'is-active' : ''} onClick={() => openSidebarDropdown('languages')}>Languages</button>

							{sidebarDropdownActiveItem === 'languages' && (
								<div className="admin-sidebar-item-dropdown">
									<ul>
										<li>
											<Link href="/admin/languages">
												<a>List</a>
											</Link>
										</li>

										<li>
											<Link href="/admin/languages/create">
												<a>Create</a>
											</Link>
										</li>
									</ul>
								</div>
							)}
						</div>
					</li>

					<li>
						<div className="admin-sidebar-item">
							<button onClick={() => {
								if (window) {
									clearLocalStorage()
								}
							}}>Log Out</button>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default AdminSidebar;
