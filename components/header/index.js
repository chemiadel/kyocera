// Packages
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {gql, useQuery} from '@apollo/client';
// Components
import ProfileDropdown from './profile';
import IndustriesDropdown from './industries';
import ProfessionsDropdown from './professions';
import LanguagesDropdown from './languages';
// Queries
import {FIND_INDUSTRIES_QUERY, FIND_LANGUAGES_QUERY, FIND_PROFESSIONS_QUERY} from '../../lib/queries';
import {useAuth} from "../../lib/azureAuth/authContext"

const GET_INDUSTRY = gql`
	query findIndustries($id: ID!, $professionId: ID!, $languageId: ID!) {
		findIndustries( filter: { id: { eq: $id }, languageId: { eq: $languageId }, deleted: { ne: true } } ) {
			items {
				id
				name
				
				language {
					id
					name
				}

				professions( filter: { id: { eq: $professionId }, deleted: { ne: true } } ) {
					id
					name
				}
			}
		}
	}
`;

function getClosest(el, tag) {
  // this is necessary since nodeName is always in upper case
  tag = tag.toUpperCase();
  do {
    if (el.nodeName === tag) {
      // tag name is found! let's return it. :)
      return el;
    }
  } while (el = el.parentNode);

  // not found :(
  return null;
}


function useOutsideAlerter(ref, cb) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				if (getClosest(event.target, 'header') === null) {
					return cb();
				}
			}
		}

		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

const Header = () => {
	// Hooks
	const router = useRouter();
	const dropdownRef = useRef(null);

	// State
	const [dropdown, setDropdown] = useState(null);
	const {user, loading}= useAuth()

  const languageId = user?.language?.id ? +user?.language.id : 0;

	useOutsideAlerter(dropdownRef, () => {
		setDropdown(null);
	});

	// GraphQL
	const getIndustry = useQuery(
		GET_INDUSTRY,
		{
			variables: {
				id: router.query.industry ?? 0,
				professionId: router.query.profession ?? 0,
				languageId,
			}
		}
	);
	
	const findIndustries = useQuery(
		FIND_INDUSTRIES_QUERY,
		{
			variables: {
				languageId,
			},
		}
	);

	const findProfessionsByIndustry = useQuery(
		FIND_PROFESSIONS_QUERY,
		{
			variables: {
				industryId: router.query.industry ?? 0,
			}
		}
	);
	
	const findLanguages = useQuery(FIND_LANGUAGES_QUERY);

	// Methods
	const onOpenDropdown = (e, str) => {
		e.preventDefault();

		if (dropdown === str) {
			setDropdown(null);
			return;
		}

		setDropdown(str);
	}

	// Components
	const RenderIndustriesDropdown = () => {
		const { data } = findIndustries;

		if (data && data.findIndustries.items.length > 0) {
			return (
				<IndustriesDropdown
					isOpen={dropdown === 'industries'}
					onChangeIndustry={() => setDropdown(null)}
					role={user?.role}
					list={data.findIndustries.items}
				/>
			);
		}
		
		return <></>
	}

	const RenderProfessionsDropdown = () => {
		const { data } = findProfessionsByIndustry;
		const items = data?.findProfessions.items;

		if (data && items.length > 0) {
			return (
				<ProfessionsDropdown
					isOpen={dropdown === 'professions'}
					onChangeProfession={() => setDropdown(null)}
					role={user?.role}
					list={items}
				/>
			);
		}

		return <></>
	}

	const RenderLanguagesDropdown = () => {
		const { data } = findLanguages;

		if (data && data.findLangs.items.length > 0) {
			return (
				<LanguagesDropdown
					isOpen={dropdown === 'languages'}
					onChangeLanguage={lang => {
						setDropdown(null);

						if (lang !== null) {
							const activeUser = JSON.parse(window.localStorage.getItem('active-user'));
							activeUser.language = lang;

							window.localStorage.setItem('active-user', JSON.stringify(activeUser));
							window.location.href = '/';
						}
					}}
					list={data.findLangs.items}
				/>
			);
		}

		return <></>
	}

	return (
		<header>
			<div className="container">
				<div className="header-contain">
					<div className="header-item">
						<div className="header-item-logo">
							<Link href={!user ? '/login' : '/salestoolkit'}>
								<a>
									<img src="/img/logo.png" alt="logo" />
									<span>KYOCERA Document Solutions</span>
								</a>
							</Link>
						</div>
					</div>
			
					<div className="header-item">
						<div className="header-item-categories">
							{(getIndustry.data && getIndustry.data.findIndustries.items.length > 0) && (
								<ul>
									<li>
										<a href="#" onClick={(e) => onOpenDropdown(e, 'industries')}>{getIndustry.data.findIndustries.items[0].name}<div className="header-item-categories-border"></div><span>&or;</span></a>
									</li>

									{getIndustry.data.findIndustries.items[0].professions.length > 0 && (
										<li>
											<a href="#" onClick={(e) => onOpenDropdown(e, 'professions')}>{getIndustry.data.findIndustries.items[0].professions[0].name}<span>&or;</span></a>
										</li>
									)}

									<li>
										<a href="#" onClick={(e) => {
											e.preventDefault();
											router.push('/feedback-form')
										}}>Feedback Form</a>
									</li>
								</ul>
							)}
						</div>
					
						{(router.asPath !== '/login' && user) && (
							<div className="header-item-dropdown">
								<button onClick={(e) => onOpenDropdown(e, 'profile')}>
									<i>
										<svg id="menu" xmlns="http://www.w3.org/2000/svg" width="18.169" height="13.122" viewBox="0 0 18.169 13.122">
											<path d="M17.412,124.182H.757a.757.757,0,1,1,0-1.514H17.412a.757.757,0,1,1,0,1.514Zm0,0" transform="translate(0 -116.864)" fill="#231f20"/>
											<path d="M17.412,1.514H.757A.757.757,0,0,1,.757,0H17.412a.757.757,0,0,1,0,1.514Zm0,0" fill="#231f20"/>
											<path d="M17.412,246.846H.757a.757.757,0,1,1,0-1.514H17.412a.757.757,0,1,1,0,1.514Zm0,0" transform="translate(0 -233.724)" fill="#231f20"/>
										</svg>
									</i>
								</button>

								<div ref={dropdownRef}>
									<ProfileDropdown
										isOpen={dropdown === 'profile'}
										user={user}
										onClickItem={() => {
											setDropdown(null);
										}}
										onClickLanguageDropdown={() => {
											setDropdown('languages');
										}}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			{getIndustry?.data?.findIndustries?.items?.length > 0  ?
			<div className="header-item-categories-xs">
							{(getIndustry.data && getIndustry.data.findIndustries.items.length > 0) && (
								<ul>
									<li>
										<a href="#" onClick={(e) => onOpenDropdown(e, 'industries')}>{getIndustry.data.findIndustries.items[0].name}<div className="header-item-categories-border"></div><span>&or;</span></a>
									</li>

									{getIndustry.data.findIndustries.items[0].professions.length > 0 && (
										<li>
											<a href="#" onClick={(e) => onOpenDropdown(e, 'professions')}>{getIndustry.data.findIndustries.items[0].professions[0].name}<span>&or;</span></a>
										</li>
									)}

									<li>
										<a href="#" onClick={(e) => {
											e.preventDefault();
											router.push('/feedback-form')
										}}>Feedback Form</a>
									</li>
								</ul>
							)}
			</div>:null}

			<RenderIndustriesDropdown />

			<RenderProfessionsDropdown />

			<RenderLanguagesDropdown />
		</header>
	);
}

export default Header;
