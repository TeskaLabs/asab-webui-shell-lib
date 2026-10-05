/*
	Browser support detection utility
	Browser support: version floors first, feature probes as fallback.
	A known family below MIN_SUPPORTED is unsupported.
	Unknown user agents and versions at/above the floor are decided by probes.
*/

// First supported version per detected family. Bump when a new engine floor is required.
const MIN_SUPPORTED = {
	Safari: '16.4', // lookbehind
	Chrome: '62',
	Firefox: '78',
	Edge: '79',
	Opera: '49',
};

const DETECTORS = [
	[/Edg(?:e|A|iOS)?\/(\d+(?:\.\d+)*)/, 'Edge'],
	[/OPR\/(\d+(?:\.\d+)*)/, 'Opera'],
	[/FxiOS\/(\d+(?:\.\d+)*)/, 'Firefox'],
	[/Firefox\/(\d+(?:\.\d+)*)/, 'Firefox'],
	[/CriOS\/(\d+(?:\.\d+)*)/, 'Chrome'],
	[/Chrome\/(\d+(?:\.\d+)*)/, 'Chrome'],
	[/Version\/(\d+(?:\.\d+)*).*Safari\//, 'Safari'],
];

const PROBES = [
	// Can be extended with more probes eventually
	() => {
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

	const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
	const browser = detectBrowser(ua);
	const min = browser && MIN_SUPPORTED[browser.name];
	if (min && versionLt(browser.version, min)) {
		browserSupportedCache = false;
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

export function getBrowserLabel() {
	if (typeof navigator === 'undefined') {
		return null;
	}
	const browser = detectBrowser(navigator.userAgent || '');
	return browser ? `${browser.name} ${browser.version}` : null;
}

function detectBrowser(ua) {
	for (const [re, name] of DETECTORS) {
		const match = ua.match(re);
		if (match) {
			return { name, version: match[1] };
		}
	}
	return null;
}

// Version "less than" - returns true if version a is less than version b, false otherwise
function versionLt(a, b) {
	const as = a.split('.');
	const bs = b.split('.');
	const n = Math.max(as.length, bs.length);
	for (let i = 0; i < n; i++) {
		const x = Number(as[i] || 0);
		const y = Number(bs[i] || 0);
		if (x !== y) {
			return x < y;
		}
	}
	return false;
}
