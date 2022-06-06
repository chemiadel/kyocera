import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

const CREATE_TOKEN = gql`
	mutation createToken($userId: ID!, $token: String!, $email: String!) {
		createToken(input: { userId: $userId, token: $token, email: $email }) {
			id
			token
			email
		}
	}
`;

const RESET_PASSWORD = gql`
	mutation resetPassword($token: String!, $email: String!) {
		resetPassword(input: { email: $email, token: $token }) {
			userId
			token
		}
	}
`;

const ForgotPassword = () => {
	// State
	const [email, setEmail] = useState('');
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	// GraphQL
	const [createToken] = useMutation(CREATE_TOKEN);
	const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

	const onSubmit = async (e) => {
		e.preventDefault();

		setError(null);
		setSuccess(false);

		try {
			const token = uuidv4();

			const res = await resetPassword({
				variables: {
					email,
					token
				}
			});

			await createToken({
				variables: {
					email,
					userId: res.data.resetPassword.userId,
					token,
				},
			});
			
			setSuccess(true);
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
								<h3>Forgot Password</h3>

								{success ? <p>Please check your inbox.</p> : (
									<>
										{error && <p style={{fontSize: 14, fontWeight: 500, color: 'red', marginBottom: 50}}>{error}</p>}

										<form onSubmit={(e) => onSubmit(e)}>
											<div className={`form-group ${email.length > 0 ? 'has-value' : ''}`}>
												<label htmlFor="email">Email</label>
											
												<input
													type="email"
													className="form-control"
													id="email"
													required
													value={email}
													onChange={({ target }) => setEmail(target.value.toLocaleLowerCase('tr-TR'))}
												/>
											</div>

											<div className="login-body-footer">
												<button className="btn btn-primary" type="submit">{loading ? 'Loading...' : 'Send'}</button>
											</div>
										</form>
									</>
								)}
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

export default ForgotPassword;
