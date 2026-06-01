/**
 * Escapes HTML metacharacters to prevent XSS when interpolated values are rendered
 * in HTML text or attribute contexts. Safe for use with i18next interpolation.
 *
 * Order matters: '&' is replaced first so our own entities are not double-encoded.
 * '/' is intentionally not escaped so paths and URLs remain readable.
 *
 * Covers: & < > " ' and ` (backtick, for attribute context safety).
 * Dont use it this way: dangerouslySetInnerHTML={{ __html: t('some.key') }} as it can lead to XSS vulnerabilities
 */
export const escapeHtmlMinimal = (value) => {
	if (value == null) {
		return '';
	}
	const s = String(value);
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/`/g, '&#96;');
};
