import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { getBrandImage } from '../../components/branding/BrandImage';
import { useAppSelector } from 'asab_webui_components';

const NavbarBrand = ( props ) => {
	const [ brandImage, setBrandImage ] = useState({});
	const theme = useAppSelector(state => state.theme);
	const title = useAppSelector(state => state.config?.title);
	const isSidebarCollapsed = useAppSelector(state => state.sidebar?.isSidebarCollapsed);

	useEffect(() => {
		setBrandImage(getBrandImage(props, theme));
	}, [theme]);

	const href = brandImage?.href ?? "/";

	if (href.includes("http")) {
		return (
			<div id="app-brandimage">
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={isSidebarCollapsed ? brandImage?.minimized : brandImage?.full}
						alt={title}
					/>
				</a>
			</div>
		);
	}
	return (
		<div id="app-brandimage" title={title}>
			<Link to={href} style={{backgroundImage: `url(${isSidebarCollapsed ? brandImage?.minimized : brandImage?.full})`}}>
				&nbsp;
			</Link>
		</div>
	)
};

export default NavbarBrand;
