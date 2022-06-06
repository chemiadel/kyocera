import { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';

const GET_TOKEN = gql`
	query findTokens($token: String!) {
		findTokens(filter: { token: { eq: $token } }) {
			items {
				id
				userId
				token
				email
			}
		}
	}
`;
const NEW_PASSWORD_MUTATION = gql`
	mutation newPassword($id: ID!, $password: String!) {
		updateUser(input: { id: $id, password: $password }) {
			id
			fullname
			password
			role
			language {
				id
				name
				title
				statement
			}
		}
	}
`;

const NewPassword = () => {
	// State
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [error, setError] = useState(null);

	// Packages
	const router = useRouter();

	// GraphQL
	const tokenQuery = useQuery(GET_TOKEN, {
		variables: {
			token: router.query?.token ?? '',
		}
	});
	
	// const { data, loading } = useQuery();
	const [newPassword] = useMutation(NEW_PASSWORD_MUTATION);

	const onSubmit = async (e) => {
		e.preventDefault();

		setError(null);
		
		if (tokenQuery.data.findTokens.items.length === 0) {
			setError('This token not found.');

			return;
		}

		if (passwordConfirm !== password) {
			setError('Password confirm must equal to Password.');

			return;
		}

		const minErr = 'Password should at least {min} characters.';
		
		if (password.length < 10) {
			setError(minErr.replace('{min}', 10));

			return false;
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

		try {
			const res = await newPassword({
				variables: {
					id: tokenQuery.data.findTokens.items[0].userId,
					password: bcrypt.hashSync(password, 8),
				},
			});

			window.location.href = '/login';
		} catch (e) {
			setError(e.message);
		}
	}

	return (
		<main className="login">
			<div className="container-fluid">
				<section className="login">
					<div className="row">
						<div className="col-lg-6">
							<div className="login-body">
								<h3>New Password</h3>

								<p style={{marginBottom: 60, fontSize: 16, fontWeight: 500}}>
									Your password must contain:

									<ul style={{marginLeft: 20, marginTop: 12}}>
										<li>A minimum of 10 characters</li>

										<li>Upper and lower case characters</li>

										<li>At least one number and one symbol (E.g. !&#...)</li>
									</ul>
								</p>

								{error && <p style={{fontSize: 14, fontWeight: 500, color: 'red', marginBottom: 50}}>{error}</p>}

								<form onSubmit={(e) => onSubmit(e)}>
									<div className={`form-group ${password.length > 0 ? 'has-value' : ''}`}>
										<label htmlFor="password">New Password</label>
									
										<input
											type="password"
											className="form-control"
											id="password"
											required
											value={password}
											onChange={({ target }) => setPassword(target.value)}
										/>
									</div>

									<div className={`form-group ${passwordConfirm.length > 0 ? 'has-value' : ''}`}>
										<label htmlFor="password-confirm">New Password Confirm</label>
									
										<input
											type="password"
											className="form-control"
											id="password-confirm"
											required
											value={passwordConfirm}
											onChange={({ target }) => setPasswordConfirm(target.value)}
										/>
									</div>

									<div className="login-body-footer">
										<button className="btn btn-primary" type="submit">Save</button>
									</div>
								</form>
							</div>
						</div>
						
						<div className="col-lg-6">
							<div className="login-illustration">
								<img src="/img/login-illustration.jpg" alt="bg" />
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

export default NewPassword;
