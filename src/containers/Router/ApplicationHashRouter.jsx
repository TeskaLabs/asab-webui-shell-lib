import React, { useRef } from 'react';
import { createHashRouter, RouterProvider } from 'react-router';

/*
	Usage in the bootstrap.js file of the application:

	import React from 'react';
	import { createRoot } from 'react-dom/client';
	import { ApplicationHashRouter, Application } from 'asab_webui_shell';

	const ConfigDefaults = { ... };
	const modules = [ ... ];

	const root = createRoot(document.getElementById('app'));

	root.render(
		<ApplicationHashRouter>
			<Application
				configdefaults={ConfigDefaults}
				modules={modules}
			/>
		</ApplicationHashRouter>,);
*/

export default function ApplicationHashRouter({ children }) {

	/*
		Using ref to avoid re-creation of the router for every component instance.
		In dev mode it can cause multiple route renders (in strict mode).
	*/
	const routerRef = useRef(null);
	if (routerRef.current === null) {
		routerRef.current = createHashRouter([
			{
				path: '*', // All routes are handled by ApplicationRouter inside Application
				element: children
			}
		]);
	}

	return <RouterProvider router={routerRef.current} />;
}
