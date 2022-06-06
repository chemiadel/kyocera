import AdminSidebar from '@/components/admin/sidebar';
import {useState} from 'react';
import {useRouter} from 'next/router';
import {gql, useMutation} from '@apollo/client';
import {FIND_LANGUAGES_QUERY} from '../../../lib/queries';

const CREATE_AD_TENANT = gql`
	mutation createAdTenant($country_code: String!, $country_name: String!,$cid: String!,$auth: String!) {
		createAdTenant(input: { country_code: $country_code, country_name: $country_name, cid: $cid, auth: $auth,}) {
			country_code,
			country_name
		}
	}
`;

const AdminLanguagesCreate = () => {
	// State
	const [countryCode, setCountryCode] = useState('');
	const [countryName, setCountryName] = useState('');
	const [cid, setCid] = useState('');
	const [auth, setAuth] = useState('');
	const [name, setName] = useState('');
	const [statement, setStatement] = useState('');
	const router = useRouter();
	const [error, setError] = useState('');

	// GraphQL
	const [createAdTenant, state] = useMutation(
		CREATE_AD_TENANT,
		{
			refetchQueries: [
				{
					query: FIND_LANGUAGES_QUERY,
				},
			],
		},
	);

	const onSubmit = async (e) => {
		e.preventDefault();

		await createAdTenant({
			variables: {
				country_code: countryCode,
				country_name: countryName,
				cid,
				auth,
			},
		});

		window.location.href = '/admin/tenants';
	}

	return (
		<main className="admin">
			<section className="admin">
				<div className="container">
					<div className="row">
						<AdminSidebar activeItem="tenants" />

						<div className="col-lg-10">
							<div className="admin-body">
								{error.length > 0 && <p style={{color: 'red', fontSize: 14, fontWeight: '500', marginBottom: 40}}>{error}</p>}
								<form onSubmit={e => onSubmit(e)}>
									<div className={`form-group ${countryCode.length > 0 && 'has-value'}`}>
										<label htmlFor="title">Country Code</label>
										<input
											type="text"
											className="form-control"
											id="countryCode"
											value={countryCode}
											onChange={(e) => setCountryCode(e.target.value)}
											required
										/>
									</div>
									<div className={`form-group ${countryName.length > 0 && 'has-value'}`}>
										<label htmlFor="name">Country Name</label>
										<input
											type="text"
											className="form-control"
											id="countryName"
											value={countryName}
											onChange={(e) => setCountryName(e.target.value)}
											required
										/>
									</div>
									<div className={`form-group ${cid.length > 0 && 'has-value'}`}>
										<label htmlFor="statement">Azure Client</label>
										<input
											type="text"
											className="form-control"
											id="cid"
											value={cid}
											onChange={(e) => setCid(e.target.value)}
											required
										/>
									</div>
									<div className={`form-group ${auth.length > 0 && 'has-value'}`}>
										<label htmlFor="statement">Azure Authority</label>
										<input
											type="text"
											className="form-control"
											id="auth"
											value={auth}
											onChange={(e) => setAuth(e.target.value)}
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

export default AdminLanguagesCreate;
