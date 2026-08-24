import React, { useState, useMemo } from 'react';
import { useAppSelector } from 'asab_webui_components';
import { useTranslation } from 'react-i18next';

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Input,
} from 'reactstrap';


export default function TenantDropdown() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const current = useAppSelector(state => state?.tenant?.current);
	const tenants = useAppSelector(state => state?.tenant?.tenants);

	const hasSearch = tenants?.length >= 10; // Display search input if there is >= 10 tenants
	const toggle = () => {
		setIsOpen(prev => !prev);
		hasSearch && setSearchInput('');
	};

	const filteredTenants = useMemo(() => {
		if (!hasSearch || !searchInput) return tenants;

		const inputLower = searchInput.toLowerCase();
		return tenants.filter(tenant => String(tenant).toLowerCase().includes(inputLower));
	}, [tenants, searchInput, hasSearch]);

	return (
		<Dropdown isOpen={isOpen} toggle={toggle} direction="down" title={t('General|Tenant')}>
			<DropdownToggle nav caret>
				<i className="bi bi-house-lock pe-2"></i>
				<TenantLabel tenant={current}/>
			</DropdownToggle>
			{isOpen && tenants?.length > 0 && (
				<DropdownMenu
					className={`shadow overflow-y-auto${hasSearch ? ' pt-0' : ''}`}
					style={{ maxHeight: '20em' }}
				>
					<DropdownItem header>{t('General|Tenants')}</DropdownItem>
					{hasSearch
						&& <Input
							value={searchInput}
							className='px-3'
							onChange={(e) => setSearchInput(e.target.value)}
							type="text"
							placeholder={t('General|Search')}
						/>}
					{filteredTenants.map((tenant, i) => (
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
