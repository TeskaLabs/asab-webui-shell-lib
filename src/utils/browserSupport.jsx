/*
	Feature probes for capabilities required by the WebUI application bundle.
	Used after splash/auth so header and sidebar stay available.
	Keep probes as runtime checks (string RegExp) - never as source literals that
	old engines cannot parse (e.g. /(?<=x)y/ fails at parse time on Safari < 16.4).
	We can add more probes here when needed.
*/

const PROBES = [
	() => {
		// Safari < 16.4 cannot compile lookbehind assertions
		new RegExp('(?<=x)y');
	},
];

// Returns true if the browser is supported, false otherwise
// Cached for the page lifetime, so capability does not change mid-session
let browserSupportedCache = null;

export function isBrowserSupported() {
	if (browserSupportedCache !== null) {
		return browserSupportedCache;
	}
	for (const probe of PROBES) {
		try {
			probe();
		} catch (_) {
			browserSupportedCache = false;
			return browserSupportedCache;
		}
	}
	browserSupportedCache = true;
	return browserSupportedCache;
}

// Returns browser name + version for display only
export function getBrowserLabel() {
	if (typeof navigator === 'undefined') {
		return null;
	}

	const ua = navigator.userAgent || '';

	return (
		pick(ua, /Edg(?:e|A|iOS)?\/(\d+(?:\.\d+)?)/, 'Edge')
		|| pick(ua, /OPR\/(\d+(?:\.\d+)?)/, 'Opera')
		|| pick(ua, /FxiOS\/(\d+(?:\.\d+)?)/, 'Firefox')
		|| pick(ua, /Firefox\/(\d+(?:\.\d+)?)/, 'Firefox')
		|| pick(ua, /CriOS\/(\d+(?:\.\d+)?)/, 'Chrome')
		|| pick(ua, /Chrome\/(\d+(?:\.\d+)?)/, 'Chrome')
		|| pick(ua, /Version\/(\d+(?:\.\d+)?).*Safari\//, 'Safari')
	);
}

function pick(ua, re, name) {
	const match = ua.match(re);
	if (!match) {
		return null;
	}
	return match[1] ? `${name} ${match[1]}` : name;
}
