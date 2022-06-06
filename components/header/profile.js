import { useRouter } from 'next/router';
import {clearLocalStorage, getLocalStorage} from "../../lib/helpers/localstorage.helper";
import {useMsal} from "@azure/msal-react";
import { fromAzure } from 'lib/helpers/from-azure.helper';
import {useAuth} from "../../lib/azureAuth/authContext"
import nookies from 'nookies'

const ProfileDropdown = ({ isOpen, onClickItem, onClickLanguageDropdown, role }) => {
	const { instance } = useMsal();
	const router = useRouter();
	const { user, setUser }= useAuth()
	const onLogOut = () => {
		const {fromAzure, id} = user
		clearLocalStorage();
		nookies.destroy(null ,'active-user')
		nookies.destroy(null ,'access-token')
		setUser(null)
		
		if (fromAzure) { 
			const logoutRequest = { 
				account: instance.getAccountByHomeId(id),
				mainWindowRedirectUri: "/",
				postLogoutRedirectUri: "/"
			}
			instance.logoutRedirect(logoutRequest);
		} else {
			window.location.href="/login"
		}
	}

	return (
		<>
			{isOpen && (
				<div className="header-item-dropdown-list">
					<div className="header-item-dropdown-list-item">
						<a href="#" className="logout" onClick={() => {
							onLogOut();
							onClickItem();
						}}>Log Out</a>
					</div>

					<div className="header-item-dropdown-list-item">
						<a href="#" className="admin" onClick={e => {
							e.preventDefault();

							onClickItem();

							router.push('/feedback-form');
						}}>Feedback Form</a>
					</div>

					{user.role === 'ADMIN' && (
						<div className="header-item-dropdown-list-item">
							<a href="#" className="admin" onClick={e => {
								e.preventDefault();

								onClickItem();

								router.push('/admin');
							}}>Admin</a>
						</div>
					)}

					<div className="header-item-dropdown-list-item user">
						<h5>Username</h5>

						<p>{user.fullname}</p>
					</div>

					<div className="header-item-dropdown-list-item">
						<a href="#" className="lang" onClick={(e) => {
							e.preventDefault();

							if (user?.role === 'ADMIN' || user?.role === 'EDITOR') {
								onClickLanguageDropdown();
							}
						}}>
							<i>
								<svg xmlns="http://www.w3.org/2000/svg" width="15.313" height="15.313" viewBox="0 0 15.313 15.313">
									<g transform="translate(0.25 0.25)">
										<path d="M13.451,3.136c-.113-.159-.23-.314-.356-.464A7.392,7.392,0,0,0,7.406,0H7.363A7.4,7.4,0,0,0,1.717,2.672q-.187.225-.356.464a7.38,7.38,0,0,0,0,8.541c.113.159.231.314.356.464a7.394,7.394,0,0,0,5.646,2.671h.043a7.393,7.393,0,0,0,5.69-2.672c.125-.15.243-.305.356-.464a7.38,7.38,0,0,0,0-8.541ZM5.241.963A6.928,6.928,0,0,0,3.605,3.732a7.064,7.064,0,0,1-1.4-.7A6.817,6.817,0,0,1,5.241.963ZM1.851,3.5a7.8,7.8,0,0,0,1.582.8,11.8,11.8,0,0,0-.405,3.045H.609A6.759,6.759,0,0,1,1.851,3.5ZM.632,7.952H3.039a11.675,11.675,0,0,0,.393,2.563,7.757,7.757,0,0,0-1.581.8A6.753,6.753,0,0,1,.632,7.952Zm1.577,3.824a7.106,7.106,0,0,1,1.4-.694,6.922,6.922,0,0,0,1.637,2.768A6.815,6.815,0,0,1,2.209,11.775ZM7.1,14.183c-1.247-.171-2.323-1.45-2.934-3.292A11.232,11.232,0,0,1,7.1,10.442Zm0-4.348a11.573,11.573,0,0,0-3.1.486,11.268,11.268,0,0,1-.351-2.37H7.1Zm0-2.491H3.635A11.472,11.472,0,0,1,4,4.492a11.575,11.575,0,0,0,3.1.486V7.344Zm0-2.973a11.217,11.217,0,0,1-2.932-.449C4.781,2.081,5.856.8,7.1.63Zm7.1,2.973H11.75a11.8,11.8,0,0,0-.4-3.033,7.8,7.8,0,0,0,1.614-.81A6.76,6.76,0,0,1,14.2,7.344ZM12.6,3.037a7.093,7.093,0,0,1-1.429.706A6.91,6.91,0,0,0,9.517.945,6.817,6.817,0,0,1,12.6,3.037ZM7.71.634c1.233.191,2.3,1.468,2.9,3.3a11.235,11.235,0,0,1-2.9.44Zm0,4.344A11.594,11.594,0,0,0,10.778,4.5a11.444,11.444,0,0,1,.364,2.841H7.71Zm0,2.973h3.42a11.314,11.314,0,0,1-.349,2.36,11.6,11.6,0,0,0-3.07-.476V7.952Zm0,6.227V10.442a11.254,11.254,0,0,1,2.9.44C10.007,12.711,8.943,13.988,7.71,14.179Zm1.806-.311a6.9,6.9,0,0,0,1.66-2.8,7.1,7.1,0,0,1,1.427.705A6.819,6.819,0,0,1,9.517,13.868Zm3.445-2.556a7.776,7.776,0,0,0-1.614-.81,11.671,11.671,0,0,0,.389-2.551H14.18A6.743,6.743,0,0,1,12.962,11.313Z" stroke="#000" strokeWidth="0.5"/>
									</g>
								</svg>
							</i>

							{user.language.title}
						</a>
					</div>
				</div>
			)}
		</>
	);
}

export default ProfileDropdown;
