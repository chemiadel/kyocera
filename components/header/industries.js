import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'graphql-hooks';
import { useRouter } from 'next/router';

const IndustriesDropdown = ({ isOpen, onChangeIndustry, list, role }) => {
	const router = useRouter();

	return (
		<>
			{isOpen && (
				<div className="header-categories-list">
					<div className="container">
						<ul>
							{list.map(({ id, name, professions }) => (
								<li key={id}>
									<a href={`/${id}/${router.query.profession}`} onClick={(e) => {
										e.preventDefault();

										router.push({
											pathname: '/kyocera/[industry]/[profession]',
											query: { industry: id, profession: professions[0]?.id ?? 0 },
										});

										onChangeIndustry();
									}}>
										{name}
									</a>
								</li>
							))}

							{(role === 'ADMIN' || role === 'EDITOR') && (
								<li>
									<a
										href="/"
										style={{ color: '#0a9bcd' }}
										onClick={e => {
											e.preventDefault();

											router.push('/');
											onChangeIndustry();
										}}
									>
										Create New Industry
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

export default IndustriesDropdown;