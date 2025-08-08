import React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { useAppSelector } from 'asab_webui_components';
import ApplicationScreenTitle from "./ApplicationScreenTitle";

import './header.scss';

export default function Header(props) {
	const headerNavItems = useAppSelector(state => state.header?.headerNavItems);

	return (
		<header id="app-header">
			<Nav className="d-flex flex-row nav w-100 h-100 align-items-center">
				<NavItem className="mx-1 fullscreen-visible">
					<ApplicationScreenTitle app={props.app} />
				</NavItem>

				<div className="flex-fill">&nbsp;</div>

				{/*
					Adding items to the header must be done by using addComponent:

					const headerService = app.locateService("HeaderService");
					headerService.addComponent({
						component: NavLink,
						componentProps: {children: "My redirect button", href: "#/redirect", style: {marginRight: "2rem"}},
						order: 900
					});

				*/}

				{headerNavItems.map((item, idx) => (
					<NavItem className={`mx-1 ${item.fullscreenVisible == true ? 'fullscreen-visible': ''}`} key={idx}>
						<item.component key={item} {...item.componentProps} app={props.app}/>
					</NavItem>
				))}

			</Nav>
		</header>
	);
}
