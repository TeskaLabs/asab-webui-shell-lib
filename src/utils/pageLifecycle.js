/*
	Page lifecycle helpers

	Low-level fan-out wrappers around browser page lifecycle events.
	These are used exclusively by Application._initPageLifecycleBridge to build
	the app-level PubSub topic `Application.lifecycle!`

	Exported event types bridged:
	  'pagehide' - subscribePageHide
	  TODO: implement 'pageshow'

	subscribePageHide attaches a single window 'pagehide' listener and fans out
	to registered callbacks. Callers receive the native PageTransitionEvent and
	should check event.persisted when they care about bfcache vs real unload.

	Returns an unsubscribe function. The window listener is removed when the
	last subscriber unsubscribes.

	An optional AbortSignal can be passed as the second argument to tie the
	subscription lifetime to an AbortController - the callback is removed
	automatically when the signal is aborted, without needing to call the
	returned unsubscribe function explicitly.

	Usage:

	PREFERRED - subscribe via the app-level PubSub topic Application.lifecycle!
	Current types: 'pagehide'  (more will be added, e.g. 'pageshow')

		import { usePubSub } from 'asab_webui_components';

		function MyComponent() {
			const { subscribe } = usePubSub();
			useEffect(() => {
				const unsubscribe = subscribe('Application.lifecycle!', ({ type, persisted }) => {
				if (type === 'pagehide' && !persisted) {
					// real unload
				}
				});
				return unsubscribe; // React cleans up on unmount
			}, []);
		}
*/

const pageHideCallbacks = new Set();

function onPageHide(event) {
	pageHideCallbacks.forEach((callback) => {
		try {
			callback(event);
		} catch (err) {
			console.error('pageLifecycle: pagehide callback failed', err);
		}
	});
}

// Subscribe to window 'pagehide' event
export function subscribePageHide(callback, signal) {
	if (typeof callback !== 'function') {
		return () => {};
	}
	if (typeof window === 'undefined') {
		return () => {};
	}
	if (signal?.aborted) {
		return () => {};
	}

	const wasEmpty = pageHideCallbacks.size === 0;
	pageHideCallbacks.add(callback);
	if (wasEmpty) {
		window.addEventListener('pagehide', onPageHide);
	}

	const unsubscribe = () => {
		pageHideCallbacks.delete(callback);
		if (pageHideCallbacks.size === 0 && typeof window !== 'undefined') {
			window.removeEventListener('pagehide', onPageHide);
		}
	};

	signal?.addEventListener('abort', unsubscribe, { once: true });

	return unsubscribe;
}
