import { useRouter } from 'next/router';

const LanguagesDropdown = ({ isOpen, onChangeLanguage, list }) => {
	const router = useRouter();

	return (
		<>
			{isOpen && (
				<div className="header-categories-list">
					<div className="container">
						<ul>
							{list.map((lang) => (
								<li key={lang.id}>
									<a href="#" onClick={(e) => {
										e.preventDefault();

										onChangeLanguage(lang);
									}}>
										{lang.title}
									</a>
								</li>
							))}

							<li>
								<a
									href="/"
									style={{ color: '#0a9bcd' }}
									onClick={e => {
										e.preventDefault();

										router.push('/admin/languages/create');
										onChangeLanguage(null);
									}}
								>
									Create New Language
								</a>
							</li>
						</ul>
					</div>
				</div>
			)}
		</>
	);
}

export default LanguagesDropdown;