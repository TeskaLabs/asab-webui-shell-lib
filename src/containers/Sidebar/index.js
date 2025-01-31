import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from 'reactstrap';
import SidebarBottomItem from './SidebarBottomItem';
import { COLLAPSE_SIDEBAR } from "../../actions";
import { getBrandImage } from '../../components/branding/BrandImage';

import './sidebar.scss';
import { SidebarItemRenderer } from './SidebarItemRenderer';

export default function Sidebar (props) {
	const [isSmallResolution, setIsSmallResolution] = useState(false)
	const [sidebarBottomBranding, setSidebarBottomBranding] = useState({});
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const sidebarItems = useSelector(state => state.navigation?.navItems);
	const sessionExpired = useSelector(state => state.auth?.sessionExpired);
	const theme = useSelector(state => state.theme);
	const dispatch = useDispatch();

	useEffect(() => {
		// Collapse sidebar if innerWidth is smaller or equal to 944px on page initialization
		if (window.innerWidth <= 944) {
			dispatch({
				type: COLLAPSE_SIDEBAR,
				isSidebarCollapsed: true
			});
		}
	}, [])

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
