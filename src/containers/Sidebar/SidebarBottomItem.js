import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppStore } from 'asab_webui_components';

import { COLLAPSE_SIDEBAR } from '../../actions';

const SidebarBottomItem = ({ sidebarLogo }) => {
	const isSidebarCollapsed = useAppSelector(state => state.sidebar.isSidebarCollapsed);

	const { t } = useTranslation();
	const { dispatch } = useAppStore();

	// Handle toggle of the sidebar's collapsed state
	const onCollapse = (event) => {
		event.stopPropagation();
		dispatch({
			type: COLLAPSE_SIDEBAR,
			isSidebarCollapsed: !isSidebarCollapsed
		});
	};

	const logoUrl = isSidebarCollapsed ? sidebarLogo?.minimized : sidebarLogo?.full;

	return (
		<>
			<div className='nav-item d-flex align-items-center' role='group'>
				<Link id='app-sidebar-logo' to='/about' style={{backgroundImage: `url(${logoUrl})`}} title={t(`Sidebar|About`)}>
					&nbsp;
				</Link>
				{!isSidebarCollapsed &&
					<i
						id='app-sidebar-collapse'
						title={t(`Sidebar|Collapse`)}
						onClick={onCollapse}
						className='fs-4 bi bi-chevron-left text-primary'
					/>
				}
			</div>

			{isSidebarCollapsed &&
				<div className='nav-item'>
					<i
						id='app-sidebar-expand'
						title={t(`Sidebar|Expand`)}
						onClick={onCollapse}
						className='nav-link fs-4 bi bi-chevron-right text-primary'
					/>
				</div>
			}
		</>
	);
};

export default SidebarBottomItem;
