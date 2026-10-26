import React from "react";
import { useLocation } from "react-router";
import { SidebarItem, SidebarCollapsibleItem } from "./SidebarItem";
import { navItemMatchesRoute } from "./utils/sidebarRouteMatch.jsx";

export const SidebarItemRenderer = ({ sidebarItems, sessionExpired, isSmallResolution = undefined, beacon = undefined }) => {
	const location = useLocation();
	/*
		Default-open the first collapsible unless some other sidebar item already owns the route.
		If the first item itself matches (e.g. its child), start open to avoid a closed-then-open flash.
	*/
	const otherItemOwnsRoute = sidebarItems?.slice(1).some((item) =>
		navItemMatchesRoute(location.pathname, item)
	);

	return (
		<nav className="nav flex-column">
			{sidebarItems.map((item, idx) => (
				item.children ? (
					<SidebarCollapsibleItem
						key={idx}
						item={item}
						disabled={sessionExpired}
						isSmallResolution={isSmallResolution}
						beacon={beacon}
						defaultOpen={idx === 0 && !otherItemOwnsRoute}
					/>
				) : (
					<SidebarItem
						key={idx}
						item={item}
						disabled={sessionExpired}
						isSmallResolution={isSmallResolution}
						beacon={beacon}
					/>
				)
			))}
		</nav>
	)
}
