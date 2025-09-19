import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppStore } from 'asab_webui_components';

import { Modal } from 'reactstrap';
import SidebarBottomItem from './SidebarBottomItem';
import { COLLAPSE_SIDEBAR } from "../../actions";
import { getBrandImage } from '../../components/branding/BrandImage';

import './sidebar.scss';
import { SidebarItemRenderer } from './SidebarItemRenderer';

/*
	Example of use hasSidebar.
	It must be set in App configuration.
	If not set to `false` or at all, it is considered as true.

	...

	const ConfigDefaults = {
		...
		hasSidebar: false,
	}

	root.render(
		<HashRouter>
			<Application
				configdefaults={ConfigDefaults} 
				modules={modules}
			/>
		</HashRouter>
	);
*/

export default function Sidebar (props) {
	const [isSmallResolution, setIsSmallResolution] = useState(false)
	const [sidebarBottomBranding, setSidebarBottomBranding] = useState({});
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const sidebarItems = useAppSelector(state => state.navigation?.navItems);
	const hasSidebar = useAppSelector(state => state?.config?.hasSidebar);
	const sessionExpired = useAppSelector(state => state.auth?.sessionExpired);
	const theme = useAppSelector(state => state.theme);

	const { dispatch } = useAppStore();

	// Handling sidebar-hidden app class
	useEffect(() => {
		const appElement = document.getElementById("app");
		if (!appElement) return;

		if (hasSidebar === false) {
			appElement.classList.add("sidebar-hidden");
		} else {
			appElement.classList.remove("sidebar-hidden");
		}
	}, [hasSidebar]);


	// If specifically declared in the configuration, that sidebar should not be available, dont display sidebar at all
	if (hasSidebar === false) {
		return null;
	}

	useEffect(() => {
		// Collapse sidebar if innerWidth is smaller or equal to 944px on page initialization
		if (window.innerWidth <= 944) {
			dispatch({
				type: COLLAPSE_SIDEBAR,
				isSidebarCollapsed: true
			});
		}
	}, []);

	useEffect(() => {
		setSidebarBottomBranding(getBrandImage(props, theme, 'sidebarLogo'));
	}, [theme]);

	const toggleSidebarModal = () => setIsSmallResolution(!isSmallResolution);

	return (
		<>
		{windowWidth <= 768 ? (
			<>
				<div onClick={toggleSidebarModal}>
					<i className="bi ms-2 bi-list text-primary fs-1"></i>
				</div>

				<Modal isOpen={isSmallResolution} toggle={toggleSidebarModal} className="left">
					<div className="sidebar-modal">
						<SidebarItemRenderer
							sidebarItems={sidebarItems}
							sessionExpired={sessionExpired}
							isSmallResolution={isSmallResolution}
						/>
					</div>
				</Modal>
			</>
		) : (
			<div className="h-100" id="app-sidebar">
				<SidebarItemRenderer
					sidebarItems={sidebarItems}
					sessionExpired={sessionExpired}
				/>
				<div className="flex-fill">&nbsp;</div>
				<SidebarBottomItem sidebarLogo={sidebarBottomBranding} disabled={sessionExpired} />
			</div>
			)
		}
		</>
	);
}
