import { lazy } from 'react';
import { Module } from 'asab_webui_components';


export default class AboutModule extends Module {
	constructor(app, name) {
		super(app, "AboutModule");

		const AboutScreen = lazy(() => import('./AboutScreen'));

		app.Router.addRoute({
			path: "/about",
			end: true,
			name: "About",
			component: AboutScreen,
			resource: "*"
		});

	}
}
