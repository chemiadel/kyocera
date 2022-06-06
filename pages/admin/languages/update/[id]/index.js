import AdminSidebar from '@/components/admin/sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import { FIND_LANGUAGES_QUERY } from '../../../../../lib/queries';

const GET_LANGUAGE_QUERY = gql`
	query getLanguage($id: ID!) {
		getLang(id: $id) {
			id
			name
			title
			statement
		}
	}
`;

const UPDATE_LANGUAGE_MUTATION = gql`
	mutation updateLanguage($id: ID!, $title: String!, $name: String!, $statement: String!) {
		updateLang(input: { id: $id, title: $title, name: $name, statement: $statement }) {
			id
			title
			name
			statement
		}
	}
`;

const AdminLanguagesUpdate = () => {
	// State
	const [title, setTitle] = useState('');
	const [name, setName] = useState('');
	const [statement, setStatement] = useState('');
	const router = useRouter();
	const [error, setError] = useState('');

	// GraphQL
	const { data, loading } = useQuery(
		GET_LANGUAGE_QUERY,
		{
			variables: {
				id: router.query.id ?? 0,
			}
		}
	);

	const [updateLanguage, state] = useMutation(
		UPDATE_LANGUAGE_MUTATION,
		{
			refetchQueries: [
				{
					query: FIND_LANGUAGES_QUERY,
				},
			],
		},
	);

	useEffect(() => {
		if (data) {
			const { getLang } = data;

			setTitle(getLang?.title ?? '');
			setName(getLang?.name ?? '');
			setStatement(getLang?.statement ?? '');
		}
	}, [data]);

	const onSubmit = async (e) => {
		e.preventDefault();

		await updateLanguage({
			variables: {
				id: router.query.id,
				name,
				title,
				statement,
			},
		});

		router.push('/admin/languages');
	}

	return (
		<main className="admin">
			<section className="admin">
				<div className="container">
					<div className="row">
						<AdminSidebar activeItem="languages" />

						<div className="col-lg-10">
							<div className="admin-body">
								{error.length > 0 && <p style={{color: 'red', fontSize: 14, fontWeight: '500', marginBottom: 40}}>{error}</p>}
								<form onSubmit={e => onSubmit(e)}>
									<div className={`form-group ${title.length > 0 && 'has-value'}`}>
										<label htmlFor="title">Title</label>
										<input
											type="text"
											className="form-control"
											id="title"
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											required
										/>
									</div>
									<div className={`form-group ${name.length > 0 && 'has-value'}`}>
										<label htmlFor="name">Name</label>
										<input
											type="text"
											className="form-control"
											id="name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
										/>
									</div>
									<div className={`form-group ${statement.length > 0 && 'has-value'}`}>
										<label htmlFor="statement">Statement</label>
										<input
											type="text"
											className="form-control"
											id="statement"
											value={statement}
											onChange={(e) => setStatement(e.target.value)}
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
