import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
	Collapse, Tooltip
} from 'reactstrap';

import { AttentionBadge } from 'asab_webui_components';

import Icon from './SidebarIcon';

export const SidebarItem = ({
	item, disabled, isOpen, setOpen, isSmallResolution, beacon = undefined
}) => {
	const location = useLocation();
	const { t } = useTranslation();
	const isSidebarCollapsed = useSelector(state => state.sidebar?.isSidebarCollapsed);
	const attentionRequired = useSelector(state => state.attentionrequired?.beacon);
	const [isActive, setActive] = useState(false);
	const lowercasedItemName = item?.name?.toLowerCase();
	// Attention requred flag
	const itemBeacon = beacon ? beacon[`beacon.${lowercasedItemName}`] : attentionRequired[`beacon.${lowercasedItemName}`];

	useEffect(() => {
		if(isOpen && !isActive) {
			setOpen(false)
		}

		setActive((item.url && (location.pathname === item.url || location.pathname.startsWith(item.url + '/'))) ? true : false);

	}, [location]);

	return (
		<div className="nav-item">
			<Link disabled={disabled} to={item.url} title={t(`Sidebar|${item.name}`)} className={"nav-link" + (isActive ? " active" : "")}>
				{(!isSidebarCollapsed || isSmallResolution) ? //hide item.name if sidebar is collapsed
				<div className="d-flex align-items-center">
					<div className="sidebar-item-name d-flex align-items-center  flex-grow-1">
						<Icon icon={item.icon} className="pe-2" />
						<span className="sidebar-item-name">
							{t(`Sidebar|${item.name}`)}
						</span>
					</div>
					{itemBeacon &&
						<AttentionBadge className='sidebar-badge-collapsed' content={itemBeacon} />
					}
				</div>
				:
				<>
					<Icon icon={item.icon} className="pe-2" />
					{itemBeacon &&
						<AttentionBadge className='sidebar-badge-collapsed' content={itemBeacon} />
					}
				</>}
			</Link>
		</div>
	);
}


export const SidebarCollapsibleItem = ({
	item, disabled, isSmallResolution
}) => {
	const [isOpen, setOpen] = useState(false);
	const location = useLocation();
	const { t } = useTranslation();
	const isSidebarCollapsed = useSelector(state => state.sidebar?.isSidebarCollapsed);
	const attentionRequired = useSelector(state => state.attentionrequired?.beacon);
	const lowercasedItemName = item.name.toLowerCase();

	// Attention required flag
	const itemsBeacon = parentBeacon(attentionRequired, `beacon.${lowercasedItemName}`, lowercasedItemName);
	// Summarize parent beacon count based on children
	const beaconCount = itemsBeacon && Object.keys(itemsBeacon).length > 0
		? Object.values(itemsBeacon).reduce((sum, current) => {
		return sum + (current.count || 0); // Ensure we sum only valid count values
	}, 0) : 0;

	// Should collapsed item uncollapse
	useEffect(() => {
		if (item.children && !isOpen) {
			for (const child of item.children) {
				if (location.pathname.includes(child.url)) {
				  setOpen(true);
				  break;
				}
			}
		}
	}, [isOpen]);

	const onClickOpen = (e) => {
		e.preventDefault();
		setOpen(!isOpen);
	}

	return (
		<>
			<div className={"nav-item sidebar-collapsible" + (isOpen ? " open" : "")}>
				<a onClick={onClickOpen} title={t(`Sidebar|${item.name}`)} className={"d-flex align-items-center nav-link" + (isOpen ? " open" : "")} href="#">
					{(!isSidebarCollapsed || isSmallResolution) ?
						<>
							<span className="d-flex flex-column justify-content-center align-items-center pe-2">
								<Icon icon={item.icon} />
								<i className="bi bi-chevron-down"></i>
							</span>

							{/* Hide item.name if sidebar is collapsed */}
							<span className="sidebar-item-name">
								{t(`Sidebar|${item.name}`)}
							</span>

							<div className="ms-auto"> {/* Added ms-auto to push SidebarBeacon to the end */}
								{(beaconCount > 0) &&
									<AttentionBadge className='sidebar-badge-collapsed' content={{count: beaconCount}} />
								}
							</div>
						</>
					:
						<div className="d-flex flex-column justify-content-center align-items-center">
							<span className="d-flex flex-column justify-content-center align-items-center">
								<Icon icon={item.icon} />
								<i className="bi bi-chevron-down"></i> {/* Optional: add small margin if needed */}
							</span>
							{beaconCount > 0 && (
								<div className='mt-1 w-100 justify-content-center d-flex'>
									<AttentionBadge className='sidebar-badge-collapsed' content={{count: beaconCount}} />
								</div>
							)}
						</div>
					}
				</a>
			</div>

			<Collapse isOpen={isOpen} className="sidebar-collapse">
				{item.children.map((child, idx) => (
					<SidebarItem
						key={idx}
						item={child}
						disabled={disabled}
						isOpen={isOpen}
						setOpen={setOpen}
						isSmallResolution={isSmallResolution}
						beacon={itemsBeacon[`beacon.${child?.name?.toLowerCase()}`] && childBeacon(itemsBeacon, `beacon.${child.name.toLowerCase()}`)}
					/>
				))}
			</Collapse>
		</>
	)
}

// Filter beacon for the parent
const parentBeacon = (data, prefix, itemName) => {
	if (!data) {
		return {};
	}
	return Object.keys(data)
		.filter(key => key.startsWith(prefix))
		.reduce((result, key) => {
			result[key.replace(`.${itemName}`, '')] = data[key];
			return result;
		}, {});
};

// Filter beacon for the children
const childBeacon = (data, key) => {
	return data[key] ? { [key]: data[key] } : {};
};
