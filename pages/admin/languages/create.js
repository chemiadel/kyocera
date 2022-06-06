import AdminSidebar from '@/components/admin/sidebar';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import { FIND_LANGUAGES_QUERY } from '../../../lib/queries';

const CREATE_LANGUAGE_MUTATION = gql`
	mutation createLanguage($title: String!, $name: String!, $statement: String!) {
		createLang(input: { title: $title, name: $name, statement: $statement }) {
			id
			title
			name
			statement
		}
	}
`;

const AdminLanguagesCreate = () => {
	// State
	const [title, setTitle] = useState('');
	const [name, setName] = useState('');
	const [statement, setStatement] = useState('');
	const router = useRouter();
	const [error, setError] = useState('');

	// GraphQL
	const [createLanguage, state] = useMutation(
		CREATE_LANGUAGE_MUTATION,
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

		await createLanguage({
			variables: {
				name,
				title,
				statement,
			},
		});

		window.location.href = '/admin/languages';
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
