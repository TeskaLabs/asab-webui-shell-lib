import React from "react";
import { SidebarItem, SidebarCollapsibleItem } from "./SidebarItem";

export const SidebarItemRenderer = ({ sidebarItems, sessionExpired, isSmallResolution = undefined }) => {

	return (
		<nav className="nav flex-column">
			{sidebarItems.map((item, idx) => (
				item.children ? (
					<SidebarCollapsibleItem
						key={idx}
						item={item}
						disabled={sessionExpired}
						isSmallResolution={isSmallResolution}
					/>
				) : (
					<SidebarItem
						key={idx}
						item={item}
						disabled={sessionExpired}
						isSmallResolution={isSmallResolution}
					/>
				)
			))}
		</nav>
	)
}
