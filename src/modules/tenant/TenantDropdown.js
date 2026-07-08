import React, { useState } from 'react';
import { useAppSelector } from 'asab_webui_components';
import { useTranslation } from 'react-i18next';

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from 'reactstrap';


export default function TenantDropdown() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const current = useAppSelector(state => state?.tenant?.current);
	const tenants = useAppSelector(state => state?.tenant?.tenants);

	const toggle = () => setIsOpen(prev => !prev);

	return (
		<Dropdown isOpen={isOpen} toggle={toggle} direction="down" title={t('General|Tenant')}>
			<DropdownToggle nav caret>
				<i className="bi bi-house-lock pe-2"></i>
				<TenantLabel tenant={current}/>
			</DropdownToggle>
			{isOpen && tenants?.length > 0 && (
				<DropdownMenu className="shadow overflow-y-auto" style={{ maxHeight: '20em' }}>
					<DropdownItem header>{t('General|Tenants')}</DropdownItem>
					{tenants.map((tenant, i) => (
						<DropdownItem key={i} tag="a" href={'?tenant='+tenant+'#/'}>
							<TenantLabel tenant={tenant}/>
						</DropdownItem>
					))}
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
