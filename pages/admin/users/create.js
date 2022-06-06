import AdminSidebar from '@/components/admin/sidebar';
import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import bcrypt from 'bcryptjs';

import { FIND_LANGUAGES_QUERY } from '../../../lib/queries';

const CREATE_USER_MUTATION = gql`
	mutation createUser($fullname: String!, $email: String!, $password: String!, $role: RoleEnum, $languageId: ID!) {
		createUser(input: { fullname: $fullname, email: $email, password: $password, role: $role, languageId: $languageId }) {
			id
			fullname
			email
			role
		}
	}
`;

const AdminUserCreate = () => {
	// State
	const [fullname, setFullname] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('USER');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	// GraphQL
	const { data, loading } = useQuery(FIND_LANGUAGES_QUERY);
	const [createUser, state] = useMutation(CREATE_USER_MUTATION);

	const onSubmit = async (e) => {
		e.preventDefault();

		setError('');

		if (validate()) {
			const { findLangs: { items } } = data;
	
			const userLanguage = items.filter(item => `@${email.split('@')[1]}` === item.statement);
			let userLanguageId;
	
			if (userLanguage.length === 0) {
				userLanguageId = '1';
			} else {
				userLanguageId = userLanguage[0].id;
			}
	
			await createUser({
				variables: {
					languageId: userLanguageId,
					fullname,
					email,
					role,
					password: bcrypt.hashSync(password, 8),
				},
			});
	
			window.location.href = '/admin/users';
		}
	}

	const validate = () => {
		const minErr = 'Password should at least {min} characters.';
		if (role === 'USER' || role === 'EDITOR') {
			if (password.length < 10) {
				setError(minErr.replace('{min}', 10));

				return false;
			}
		} else {
			if (password.length < 16) {
				setError(minErr.replace('{min}', 16));

				return false;
			}
		}

		let upper = 0;
		let lower = 0;
		let number = 0;
		let special = 0;

		for (let i = 0; i < password.length; i++) {
			if (password[i] >= 'A' && password[i] <= 'Z') {
				upper++;
			} else if (password[i] >= 'a' && password[i] <= 'z') {
				lower++;
			} else if (password[i] >= '0' && password[i] <= '9') {
				number++;
			} else {
				special++;
			}
		}

		if (upper === 0 || lower === 0 || number === 0 || special === 0) {
			setError('Your password must have combination of alphabet (upper case, lower case), numbers, symbols.');

			return false;
		}

		return true;
	}

	return (
		<main className="admin">
			<section className="admin">
				<div className="container">
					<div className="row">
						<AdminSidebar activeItem="users" />

						<div className="col-lg-10">
							<div className="admin-body">
								{error.length > 0 && <p style={{color: 'red', fontSize: 14, fontWeight: '500', marginBottom: 40}}>{error}</p>}
								<form onSubmit={e => onSubmit(e)}>
									<div className={`form-group ${fullname.length > 0 && 'has-value'}`}>
										<label htmlFor="fullname">Full Name</label>
										<input
											type="text"
											className="form-control"
											id="fullname"
											value={fullname}
											onChange={(e) => setFullname(e.target.value)}
											required
										/>
									</div>
									
									<div className={`form-group ${email.length > 0 && 'has-value'}`}>
										<label htmlFor="email">E-Mail</label>
										<input
											type="text"
											className="form-control"
											id="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>

									<div className="form-group">
										<select onChange={e => setRole(e.target.value)} className="form-control" value={role}>
											<option value="USER">USER</option>
											<option value="EDITOR">EDITOR</option>
											<option value="ADMIN">ADMIN</option>
										</select>
									</div>

									<div className={`form-group ${password.length > 0 && 'has-value'}`}>
										<label htmlFor="password">Password</label>
										<input
											type="password"
											className="form-control"
											id="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>

									<button className="btn btn-primary">Create</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default AdminUserCreate;
