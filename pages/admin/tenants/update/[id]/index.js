import AdminSidebar from '@/components/admin/sidebar';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {gql, useMutation, useQuery} from '@apollo/client';
import {FIND_AD_TENANTS} from '../../../../../lib/queries';

const GET_AD_TENANTS_QUERY = gql`
	query getAdTenant($id: ID!) {
		getAdTenant(id: $id) {
				id,
	            country_code,
	            country_name,
	            cid,
	            auth
		}
	}
`;


const UPDATE_AD_TENANT_MUTATION = gql`
	mutation updateAdTenant($id: ID!, $country_code: String!, $country_name: String!, $cid: String!, $auth: String!) {
		updateAdTenant(input: { id: $id, country_code: $country_code, country_name: $country_name, cid: $cid , auth: $auth }) {
			id
			country_code
			country_name
			cid,
			auth
		}
	}
`;

const AdminLanguagesUpdate = () => {
	// State
	const [country_code, setcountry_code] = useState('');
	const [country_name, setcountry_name] = useState('');
	const [cid, setCid] = useState('');
	const [auth, setAuth] = useState('');
	const [statement, setStatement] = useState('');
	const router = useRouter();
	const [error, setError] = useState('');
	console.log(router.query.id)
	const { data, loading } = useQuery(
		GET_AD_TENANTS_QUERY,
		{
			variables: {
				id: router.query.id ?? 'TR',
			}
		}
	);

	const [updateAdTenant, state] = useMutation(
		UPDATE_AD_TENANT_MUTATION,
		{
			refetchQueries: [
				{
					query: FIND_AD_TENANTS,
				},
			],
		},
	);

	useEffect(() => {
		if (data) {

			const { getAdTenant } = data;

			setcountry_code(getAdTenant?.country_code ?? '');
			setcountry_name(getAdTenant?.country_name ?? '');
			setCid(getAdTenant?.cid ?? '');
			setAuth(getAdTenant?.auth ?? '');


		}
	}, [data]);

	const onSubmit = async (e) => {
		e.preventDefault();

		await updateAdTenant({
			
			variables: {
				id: router.query.id,
				country_code,
				country_name,
				cid,
				auth
			},

			 
		});

		router.push('/admin/tenants');
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
									<div className={`form-group ${country_code.length > 0 && 'has-value'}`}>
										<label htmlFor="title">Country Code</label>
										<input
											type="text"
											className="form-control"
											id="country_code"
											value={country_code}
											onChange={(e) => setcountry_code(e.target.value)}
											required
										/>
									</div>
									<div className={`form-group ${country_name.length > 0 && 'has-value'}`}>
										<label htmlFor="name">Country Name</label>
										<input
											type="text"
											className="form-control"
											id="country_name"
											value={country_name}
											onChange={(e) => setcountry_name(e.target.value)}
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
