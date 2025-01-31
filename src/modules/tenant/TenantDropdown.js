import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
	UncontrolledDropdown,
	DropdownItem,
	DropdownMenu, 
	DropdownToggle,
} from 'reactstrap';


function TenantDropdown({tenants, current}) {
	const { t } = useTranslation();
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


const mapStateToProps = state => {
	return {
		current: state.tenant.current,
		tenants: state.tenant.tenants,
	};
};

export default connect(
	mapStateToProps,
	null
)(TenantDropdown);
