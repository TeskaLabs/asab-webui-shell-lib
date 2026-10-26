import React from "react";
import { useLocation } from "react-router";
import { SidebarItem, SidebarCollapsibleItem } from "./SidebarItem";
import { navItemMatchesRoute } from "./utils/sidebarRouteMatch.jsx";

export const SidebarItemRenderer = ({ sidebarItems, sessionExpired, isSmallResolution = undefined, beacon = undefined }) => {
	const location = useLocation();
	/*
		Default-open the first collapsible only when the current route is not already a sidebar item
		(plain link or another collapsible), avoids open-then-collapse flash on leaf nav routes.
	*/
	const routeMatchesSidebar = sidebarItems?.some((item) => navItemMatchesRoute(location.pathname, item));

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
						defaultOpen={idx === 0 && !routeMatchesSidebar}
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
