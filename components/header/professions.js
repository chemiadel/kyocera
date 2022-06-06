import Link from 'next/link';
import { useRouter } from 'next/router';

const ProfessionsDropdown = ({ isOpen, loading, list, onChangeProfession, role }) => {
	const router = useRouter();

	return (
		<>
			{isOpen && (
				<div className="header-categories-list">
					<div className="container">
						<ul>
							{loading ? <p>Loading...</p> : (
								<>
									{list.map(({ id, name }) => (
										<li key={name}>
											<a href={`/${router.query.industry}/${id}`} onClick={e => {
												e.preventDefault();
												
												router.push({
													pathname: '/kyocera/[industry]/[profession]',
													query: { industry: router.query.industry, profession: id }
												});

												onChangeProfession();
											}}>{name}</a>
										</li>
									))}
								</>
							)}

							{(role === 'ADMIN' || role === 'EDITOR') && (
								<li>
									<a
										href="/"
										style={{ color: '#0a9bcd' }}
										onClick={e => {
											e.preventDefault();

											router.push({
												pathname: '/kyocera/[industry]',
												query: { industry: router.query.industry }
											});

											onChangeProfession();
										}}
									>
										Create New Profession
									</a>
								</li>
							)}
						</ul>
					</div>
				</div>
			)}
		</>
	);
}

export default ProfessionsDropdown;