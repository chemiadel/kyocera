import AdminSidebar from '@/components/admin/sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import { FIND_LANGUAGES_QUERY } from '../../../../../lib/queries';
import bcrypt from 'bcryptjs';

const GET_USER_QUERY = gql`
	query getUser($id: ID!) {
		getUser(id: $id) {
			id
			fullname
			email
			role
			password
		}
	}
`;

const UPDATE_USER_MUTATION = gql`
	mutation updateUser($id: ID!, $fullname: String!, $email: String!, $password: String!, $role: RoleEnum, $languageId: ID!) {
		updateUser(input: { id: $id, fullname: $fullname, email: $email, password: $password, role: $role, languageId: $languageId }) {
			id
			fullname
			email
			role
		}
	}
`;

const AdminLanguagesUpdate = () => {
	// State
	const [fullname, setFullname] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('USER');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	// GraphQL
	const lang = useQuery(FIND_LANGUAGES_QUERY);
	const { data, loading } = useQuery(
		GET_USER_QUERY,
		{
			variables: {
				id: router.query.id ?? 0,
			}
		}
	);

	const [updateUser, state] = useMutation(UPDATE_USER_MUTATION);

	useEffect(() => {
		if (data) {
			const { getUser } = data;

			setFullname(getUser?.fullname ?? '');
			setEmail(getUser?.email ?? '');
			setRole(getUser?.role ?? '');
		}
	}, [data]);

	const onSubmit = async (e) => {
		e.preventDefault();

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

		const { findLangs: { items } } = lang.data;

		const userLanguage = items.filter(item => `@${email.split('@')[1]}` === item.statement);
		let userLanguageId;

		if (userLanguage.length === 0) {
			userLanguageId = '1';
		} else {
			userLanguageId = userLanguage[0].id;
		}

		await updateUser({
			variables: {
				id: data?.getUser?.id,
				languageId: userLanguageId,
				fullname,
				email,
				role,
				password: password.length === 0 ? data?.getUser?.password : bcrypt.hashSync(password, 8),
			},
		});

		window.location.href = '/admin/users';
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

									<button className="btn btn-primary">Update</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default AdminLanguagesUpdate;
