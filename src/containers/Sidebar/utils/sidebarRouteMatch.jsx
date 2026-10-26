// Optional item.openFor patterns, e.g. ['/route/*'] - keeps parent open on matching routes
export const matchesOpenFor = (pathname, patterns) =>
	patterns?.some((p) => {
		if (p.endsWith('*')) {
			const prefix = p.slice(0, -1);
			return pathname.startsWith(prefix) || pathname === prefix.slice(0, -1);
		}
		return pathname === p || pathname.startsWith(p + '/');
	}) ?? false;

const collapsibleMatchesRoute = (pathname, item) => {
	if (!item?.children) {
		return false;
	}
	if (matchesOpenFor(pathname, item.openFor)) {
		return true;
	}
	return item.children.some((child) => child.url && pathname.includes(child.url));
};

export const navItemMatchesRoute = (pathname, item) => {
	if (item?.children) {
		return collapsibleMatchesRoute(pathname, item);
	}
	return Boolean(item?.url && (pathname === item.url || pathname.startsWith(item.url + '/')))
		|| matchesOpenFor(pathname, item?.openFor);
};
