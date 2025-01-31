import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getBrandImage } from '../../components/branding/BrandImage';

const NavbarBrand = ( props ) => {
	const [ brandImage, setBrandImage ] = useState({});
	const theme = useSelector(state => state.theme);
	const title = useSelector(state => state.config?.title);
	const isSidebarCollapsed = useSelector(state => state.sidebar?.isSidebarCollapsed);

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
