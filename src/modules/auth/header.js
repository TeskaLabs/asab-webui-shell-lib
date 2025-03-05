import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAuthorized } from 'asab_webui_components';

import {
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button
} from 'reactstrap';

import './header.scss';

/*

	Language localizations for auth HeaderComponent can be added to the translation.json files of
	public/locales/en & public/locales/cs of the product where HeaderComponent is used.

	Example:

	{
		'AuthHeader': {
			'My account': 'My account',
			'Access control': 'Access control',
			'Manage': 'Manage',
			'Change a password': 'Change a password',
			'Logout': 'Logout',
			...
		}
	}

*/

export function AuthHeaderInvitation(props) {
	const resources = useSelector(state => state.auth?.resources);
	const tenant = useSelector(state => state.tenant?.current);
	let navigate = useNavigate();
	const { t } = useTranslation();

	if (!tenant || !isAuthorized(['seacat:tenant:assign'])) {
		return null;
	};

	return(
		<Button
			outline
			onClick={(e) => {e.preventDefault(), navigate('/auth/invite')}}
			title={t('AuthHeader|Invite other users')}
			className='invite-nav-button'
			color='primary'
		>
			<i className='bi bi-person-plus me-2' />
			{t('AuthHeader|Invite other users')}
		</Button>
	)
}

export function AuthHeaderDropdown(props) {
	const { t } = useTranslation();
	const userinfo = useSelector(state => state.auth?.userinfo);
	const isSuperuser = isAuthorized(['authz:superuser']);

	const logout = () => {
		props.AuthModule.logout();
	}

	return (
		<UncontrolledDropdown direction='down'>
			<DropdownToggle
				nav
				caret
				title={isSuperuser? t('AuthHeader|You have superuser privileges. Act responsibly.') : userinfo?.sub}
				className={isSuperuser ? 'text-warning' : ''}
			>
				{(userinfo?.picture)
					? <img src={userinfo?.picture} className='img-avatar' alt={userinfo?.username}/>
					: <i alt={userinfo?.username} className={`pe-2 bi ${isSuperuser ? 'bi-universal-access' : 'bi-person-gear'}`}
					/>
				}
				<span>{userinfo?.username || userinfo?.sub}</span>
			</DropdownToggle>
			<DropdownMenu className='shadow'>
				<DropdownItem header>{t('AuthHeader|My account')}</DropdownItem>
				<DropdownItem tag={Link} to='/auth/access-control'>
					{t('AuthHeader|Access control')}
				</DropdownItem>
				<DropdownItem tag={Link} to='/account'>
					{t('AuthHeader|Account settings')}
				</DropdownItem>
				<DropdownItem tag={Link} to='/account/password'>
					{t('AuthHeader|Change password')}
				</DropdownItem>
				<DropdownItem onClick={() => {logout()}}>
					<span className='text-danger'>
						{t('AuthHeader|Log out')}
					</span>
				</DropdownItem>
			</DropdownMenu>
		</UncontrolledDropdown>
	)
}
