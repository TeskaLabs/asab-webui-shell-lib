import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useAppSelector } from 'asab_webui_components';
import { useTranslation } from 'react-i18next';

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Input,
} from 'reactstrap';

import './TenantDropdown.scss';

export default function TenantDropdown({ app }) {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const current = useAppSelector(state => state?.tenant?.current);
	const tenants = useAppSelector(state => state?.tenant?.tenants);
	const extDropdownComponents = useAppSelector(state => state?.tenant?.extDropdownComponents) ?? [];

	const hasSearch = tenants?.length >= 10; // Display search input if there is >= 10 tenants

	// Refresh OAuth session and userinfo, causes the tenant list to be updated.
	// Used when the tenant dropdown opens so new SeaCat assignments appear without re-login.
	useEffect(function refreshTenantList() {
		if (!isOpen) {
			return
		}

		const auth = app?.Modules?.find(m => m.Name === 'AuthModule');
		if (!auth?.OAuthTokens) {
			return;
		}
		
		void auth.renewSession();
	}, [isOpen]);

	const toggle = () => {
		setIsOpen(prev => !prev);
		hasSearch && setSearchInput('');
	};

	const removeTenant = async (tenantId) => {
		const LMIOTrexAPI = app?.axiosCreate?.('lmio-trex');
		if (!LMIOTrexAPI || !current) {
			return;
		}
		try {
			const response = await LMIOTrexAPI.delete(`/${current}/tenant/${tenantId}`);
			if (response.data.result !== 'OK') {
				throw new Error(response.data?.error || 'There was an issue processing a request');
			}

			if (tenantId == current) {
				app.addAlert('success', 'Tenant removed successfully, you will be logged out in a while');
				setTimeout(() => {
					window.location.reload();
				}, 5000);
			} else {
				app.addAlert('success', 'Tenant removed successfully');
				const auth = app?.Modules?.find(m => m.Name === 'AuthModule');
				if (auth?.OAuthTokens) {
					void auth.renewSession();
				}
			}
		} catch (e) {
			app.addAlertFromException(e, 'Failed to remove the tenant');
		}
	};

	const removeTenantForm = (tenantId) => {
		if (confirm('Do you want to remove the tenant?')) {
			removeTenant(tenantId);
		}
	};

	const filteredTenants = useMemo(() => {
		if (!hasSearch || !searchInput) return tenants;

		const inputLower = searchInput.toLowerCase();
		return tenants.filter(tenant => String(tenant).toLowerCase().includes(inputLower));
	}, [tenants, searchInput, hasSearch]);

	return (
		<Dropdown className="tenant-dropdown" isOpen={isOpen} toggle={toggle} direction="down" title={t('General|Tenant')}>
			<DropdownToggle nav caret>
				<i className="bi bi-house-lock pe-2"></i>
				<TenantLabel tenant={current}/>
			</DropdownToggle>
			{isOpen && tenants?.length > 0 && (
				<DropdownMenu className={`shadow ${hasSearch ? ' pt-0' : ''} tenant-dropdown-menu`}>
					<DropdownItem header>{t('General|Tenants')}</DropdownItem>
					{hasSearch
						&& <Input
							value={searchInput}
							className='px-3'
							onChange={(e) => setSearchInput(e.target.value)}
							type="text"
							placeholder={t('General|Search')}
						/>}
					<div className='tenant-dropdown-scroll'>
						{filteredTenants.map((tenant) => (
							<DropdownItem key={tenant} tag="div" className="d-flex align-items-center">
								<a className="flex-grow-1 text-decoration-none text-body" href={`?tenant=${tenant}#/`}>
									<TenantLabel tenant={tenant} />
								</a>
								<button
									type="button"
									title="Remove tenant"
									style={{
										border: 'none',
										background: 'transparent',
										padding: 0,
										marginLeft: '0.5rem',
										color: '#dc3545',
										lineHeight: 1,
										cursor: 'pointer',
									}}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										removeTenantForm(tenant);
									}}
								>
									<i className="bi bi-trash" />
								</button>
							</DropdownItem>
						))}
					</div>
					{extDropdownComponents.length > 0 && (
						<div className="pt-2 mt-1 border-top tenant-dropdown-extensions">
							{extDropdownComponents.map((Component, i) => (
								<Suspense key={i} fallback={null}>
									{React.createElement(Component)}
								</Suspense>
							))}
						</div>
					)}
				</DropdownMenu>
			)}
		</Dropdown>
	);
}


function TenantLabel({tenant}) {
	return (
		<span>{tenant}</span>
	);
}
