import React from 'react';
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

	const router = createHashRouter([
		{
			path: '*', // Allowing all routes here is OK since routing itself is handled by the ApplicationRouter
			element: children
		}
	]);

	return <RouterProvider router={router} />;
}
