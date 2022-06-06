import {useEffect, useState} from 'react';
import {gql, useMutation, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";
import {loginRequest} from '../services/msal';
import {callMsGraph, getUserAccessToken} from '../services/ms-auth-call';
import {setLocalStorage} from "../lib/helpers/localstorage.helper";
import DropdownWidget from "@/components/widget/dropdown.widget";
import {FIND_AD_TENANTS} from "../lib/queries";
import snq from "../lib/helpers/snq";
import Layout from '@/components/layout/layout';
const { parseCookies, setCookie, destroyCookie } = require('nookies');

import {useAuth} from "../lib/azureAuth/authContext"

const LOGIN_MUTATION = gql`
	mutation login($email: String!, $password: String!) {
		login(input: { email: $email, password: $password }) {
			user{
				id
				fullname
				role
				language {
					id
					name
					title
					statement
				}
			}
			token
		}
	}
`;

const Login = (props) => {
	// State
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [isBanned, setIsBanned] = useState(false);
	const [showExternalLogin, setShowExternalLogin] = useState(false);
	const [isDisableSSOButton, setDisableSSOButton] = useState(true);

	//User state
	const {user, loading, setUser, errorAzure}= useAuth()
	const { instance } = useMsal();

	// Packages	
	const router = useRouter();

	// GraphQL
	const [login] = useMutation(LOGIN_MUTATION);
	const findAdTenants = useQuery(FIND_AD_TENANTS).data;

	
	useEffect(() => {
		return checkIfBanned();
	}, []);

	useEffect(()=>{
		if(user && !loading) window.location.href='/salestoolkit'
	},[user,loading])

	// TODO: We dont use hook because there is infinite loop. It will be fixed with kyo2

	let adTenants = [
		{
			country_code: 'NL',
			country_name: 'Netherlands',
			cid: 'dasd',
			auth: 'dsad'
		},
		{
			country_code: 'TR',
			country_name: 'Turkey',
			cid: 'dasfdsd',
			auth: 'dfdsfsad'
		}
	]

	const adTenantsForDropdown = snq(() => findAdTenants?.findAdTenants?.items, []).map( item => ({
		label: item.country_name,
		value: item
	}) )

	const callbackForAdTenants = item => {
		setLocalStorage('selectedAdTenant', item);
		// Set
		setCookie(null , 'tenant', JSON.stringify(item) )
		window.location.reload();
	}

	//findAdTenants && (adTenants = findAdTenants.findAdTenants.items)

	const diffMinutes = (x, y) => {
		return parseInt(Math.abs(x.getTime() - y.getTime()) / (1000 * 60) % 60);
	}

	async function loginMSA(){
		try {
			await instance.loginRedirect({});
			window.location.href='/'
		} catch (err) {
			// handle error
		}
	}
	
	const logoutMicrosoft = () => {
		localStorage.removeItem('active-user');
		!!instance && instance.logoutRedirect();
	}

	const checkIfBanned = () => {
		if (window.localStorage.getItem('password-error-count')) {
			const count = Number(window.localStorage.getItem('password-error-count'));
			const date = new Date(window.localStorage.getItem('password-error-date'));
			const diff = diffMinutes(new Date(), date);

			if (count === 3 || count === 6 || count === 9 || count === 12) {
				setIsBanned(true);
			}

			if (count === 3) {
				if (diff >= 15) {
					setIsBanned(false);
					window.localStorage.setItem('password-error-count', 4);
				}
			} else if (count === 6) {
				if (diff >= 30) {
					setIsBanned(false);
					window.localStorage.setItem('password-error-count', 7);
				}
			} else if (count === 9) {
				if (diff >= 90) {
					setIsBanned(false);
					window.localStorage.setItem('password-error-count', 9);
				}
			} else if (count === 12) {
				if (diff >= 120) {
					setIsBanned(false);
					window.localStorage.setItem('password-error-count', 13);
				}
			}
		}
	}

	const onSubmit = async (e) => {
		e.preventDefault();

		setError(null);

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
			setError('Your password must be at least 10 characters long and consist of (upper- and lowercase) alphabetic characters, numbers and at least one special character (e.g. ?&#). Please click “Forgot password” below to change your password');

			return false;
		}

		try {
			const res = await login({
				variables: {
					email,
					password,
				},
			});
			const activeUser = {token: res.data.login.token, ...res.data.login.user}
			setLocalStorage('active-user', activeUser)
			setLocalStorage('access-token', res.data.login.token)

			setCookie(null , 'active-user', JSON.stringify(activeUser) )
			setCookie(null , 'access-token', JSON.stringify(res.data.login.token) )

			router.reload();
		} catch (e) {
			if (e.message === 'The User ID or the user password is incorrect.') {
				window.localStorage.setItem('password-error-count', window.localStorage.getItem('password-error-count') ? Number(window.localStorage.getItem('password-error-count')) + 1 : 1);
				window.localStorage.setItem('password-error-date', new Date());
				checkIfBanned();
			}

			setError(e.message);
		}
	}


	console.log('login | loading',loading)
	console.log('login | user', user)

	if(loading || user) return null
	console.log('I appear')
	return (
		<main className="login">
			<div className="container-fluid">
				<section className="login">
					<div className="row">
						<div className="col-lg-6">
							<div className="login-body">
								<h3>Sales Toolkit</h3>
								<AuthenticatedTemplate>
									<button className="btn btn-primary sso" onClick={({ target }) => logoutMicrosoft()}>Sign-out from Microsoft</button>
								</AuthenticatedTemplate>
								<UnauthenticatedTemplate>
									<div className="row">
										<div className="col-lg-4">
											<DropdownWidget 
											label={'Domain'} 
											subitems={adTenantsForDropdown} 
											callback={callbackForAdTenants} />
										</div>
										<div className="col-lg-8">
											<button
												className="btn btn-primary sso btn-block"

												onClick={loginMSA}>
												Sign in with SSO
											</button>
										</div>
									</div>
								</UnauthenticatedTemplate>
								<button  className="btn external-link" onClick={()=> {setShowExternalLogin(!showExternalLogin)}}><a>{ showExternalLogin ? 'Hide External Login' : 'Show External Login'}</a></button>
								<p style={{fontSize: 14, fontWeight: 500, color: 'black', marginBottom: 50}}>By logging in you accept the terms of use (see link below)</p>
								{isBanned ? <h5>You're banned! Please try later...</h5> : (
									<>
										{!!errorAzure && <p style={{fontSize: 14, fontWeight: 500, color: 'red', marginBottom: 50}}>{errorAzure}</p>}
										{!!error && <p style={{fontSize: 14, fontWeight: 500, color: 'red', marginBottom: 50}}>{error}</p>}

										<form onSubmit={(e) => onSubmit(e)} style={{ display: showExternalLogin ? "block" : "none" }}>
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

											<div className={`form-group ${password.length > 0 ? 'has-value' : ''}`}>
												<label htmlFor="password">Password</label>

												<input
													type="password"
													className="form-control"
													id="password"
													required
													value={password}
													onChange={({ target }) => setPassword(target.value)}
												/>
											</div>

											<div className="login-body-footer">
												<button className="btn btn-primary" type="submit">Login</button>

												<Link href="/forgot-password"><a>Forgotten password</a></Link>
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

export default Login;
Login.getLayout = function getLayout(page) {
	return (
	  <Layout>
		{page}
	  </Layout>
	)
  }
