import React, { Component } from 'react';
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

	return (
		<UncontrolledDropdown direction="down" title={t('tenant|Tenant')}>
			<DropdownToggle nav caret>
				<i className="bi bi-house-lock pe-2"></i>
				<TenantLabel tenant={current}/>
			</DropdownToggle>
			{ (tenants && tenants.length > 0) ?
				<DropdownMenu className="shadow">
					<DropdownItem header>Tenants</DropdownItem>
					{tenants.map((tenant, i) => (
						<DropdownItem key={i} tag="a" href={'?tenant='+tenant+'#/'}>
							<TenantLabel tenant={tenant}/>
						</DropdownItem>
					))}
				</DropdownMenu>
			 : null}
		</UncontrolledDropdown>
	);
}


function TenantLabel({tenant}) {
	return (
		<span>{tenant}</span>
	);
}
