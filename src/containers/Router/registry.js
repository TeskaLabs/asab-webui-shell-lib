/*
	Module-level singleton holding the React Router data router instance
	created in bootstrap.js. Allows Router.addRoute() (called from module
	constructors after the router is created but before render completes)
	to patch new routes into the live router via router.patchRoutes().
*/

let routerInstance = null;

export function setRouterInstance(router) {
	routerInstance = router;
}

export function getRouterInstance() {
	return routerInstance;
}
