import React from 'react';
import { Link } from 'react-router';
import { useAppSelector } from 'asab_webui_components';
import { useTranslation } from 'react-i18next';
import { isAuthorized } from 'asab_webui_components/seacat-auth';

import {
	UncontrolledDropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from 'reactstrap';


export default function TenantDropdown({ app }) {
	const { t } = useTranslation();
	const current = useAppSelector(state => state?.tenant?.current);
	const tenants = useAppSelector(state => state?.tenant?.tenants);
	const canCreateTenant = isAuthorized(['lmio:tenant:create'], app);
	const tenantsAvailable = tenants && tenants.length > 0;
	const showDropdown = tenantsAvailable || canCreateTenant;

	return (
		<UncontrolledDropdown direction="down" title={t('tenant|Tenant')}>
			<DropdownToggle nav caret>
				<i className="bi bi-house-lock pe-2"></i>
				<TenantLabel tenant={current} />
			</DropdownToggle>
			{showDropdown && (
				<DropdownMenu className="shadow">
					{tenantsAvailable && (
						<>
							<DropdownItem header>
								{t('TenantDropdown|Tenants')}
							</DropdownItem>
							{tenants?.map((tenant, i) => (
								<DropdownItem key={i} tag="a" href={`?tenant=${tenant}#/`}>
									<TenantLabel tenant={tenant} />
								</DropdownItem>
							))}
						</>
					)}
					{canCreateTenant && (
						<>
							{tenantsAvailable && <DropdownItem divider />}
							<DropdownItem tag={Link} to="/config/tenant/!create">
								{t('TenantDropdown|Create tenant')}
							</DropdownItem>
						</>
					)}
				</DropdownMenu>
			)}
		</UncontrolledDropdown>
	);
}

function TenantLabel({tenant}) {
	return (
		<span>{tenant}</span>
	);
}
