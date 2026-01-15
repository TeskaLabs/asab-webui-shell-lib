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
	// TODO: when lmio_trex resource available, change this resource accordingly
	const canCreateTenant = isAuthorized(['seacat:tenant:create'], app);

	const tenantsAvailable = tenants && tenants.length > 0;

	return (
		<UncontrolledDropdown direction="down" title={t('tenant|Tenant')}>
			<DropdownToggle nav caret>
				<i className="bi bi-house-lock pe-2"></i>
				<TenantLabel tenant={current}/>
			</DropdownToggle>
			<DropdownMenu className="shadow">
				{tenantsAvailable && (
					<>
						<DropdownItem header>{t('TenantDropdown|Tenants')}</DropdownItem>
						{tenants?.map((tenant, i) => (
							<DropdownItem key={i} tag="a" href={'?tenant='+tenant+'#/'}>
								<TenantLabel tenant={tenant}/>
							</DropdownItem>
						))}
					</>
				)}
				{/* Link to lmio_trex_webui tenant creation screen */}
				{canCreateTenant && (
					<>
						<DropdownItem divider />
						<DropdownItem tag={Link} to="/config/tenant/!create">
							{t('TenantDropdown|Create tenant')}
						</DropdownItem>
					</>
				)}
			</DropdownMenu>
		</UncontrolledDropdown>
	);
}

function TenantLabel({tenant}) {
	return (
		<span>{tenant}</span>
	);
}
