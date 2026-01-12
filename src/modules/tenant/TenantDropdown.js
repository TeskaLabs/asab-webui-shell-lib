import React from 'react';
import { Link } from 'react-router';
import { useAppSelector } from 'asab_webui_components';
import { useTranslation } from 'react-i18next';

import {
	UncontrolledDropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from 'reactstrap';


export default function TenantDropdown() {
	const { t } = useTranslation();
	const current = useAppSelector(state => state?.tenant?.current);
	const tenants = useAppSelector(state => state?.tenant?.tenants);

	const resources = useAppSelector(state => state?.auth?.resources);
	const tenantCreateResource = 'authz:superuser'; // "seacat:tenant:create";
	const canCreateTenant = resources?.includes(tenantCreateResource) || resources?.includes('authz:superuser');

	return (
		<UncontrolledDropdown direction="down" title={t('tenant|Tenant')}>
			<DropdownToggle nav caret>
				<i className="bi bi-house-lock pe-2"></i>
				<TenantLabel tenant={current}/>
			</DropdownToggle>
			{(tenants && tenants.length > 0 || canCreateTenant) && (
				<DropdownMenu className="shadow">
					<DropdownItem header>{t('TenantDropdown|Tenants')}</DropdownItem>
					{tenants?.map((tenant, i) => (
						<DropdownItem key={i} tag="a" href={'?tenant='+tenant+'#/'}>
							<TenantLabel tenant={tenant}/>
						</DropdownItem>
					))}
					{canCreateTenant && (
						<>
							<DropdownItem divider />
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
