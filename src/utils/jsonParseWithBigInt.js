/**
 * Safely parses a JSON string, converting numeric values to BigInt for
 * explicitly configured keys to avoid JavaScript's Number precision loss
 * above Number.MAX_SAFE_INTEGER.
 *
 * @param {string} source - Raw JSON string to parse.
 * @param {Set<string>} bigIntKeys - Set of JSON keys whose values should be
 *   converted to BigInt.  Each key is the leaf property name as it appears
 *   in the JSON (e.g. "h", "related.events").
 *
 * Supported value shapes for a configured key:
 *   - Scalar number: BigInt via context.source (no precision loss)
 *   - Scalar string: BigInt when it looks like an integer
 *   - Array of numbers: → each element converted via context.source
 */
export function jsonParseWithBigInt(source, bigIntKeys) {
	if (typeof source !== 'string') {
		return source;
	}
	if (!bigIntKeys?.size) {
		return JSON.parse(source);
	}

	/*
		Bottom-up reviver order means array *elements* are visited before the
		parent named key. It collect each numeric element's original source text
		in a WeakMap keyed by the array reference, then convert them when the
		named key is finally visited.
	*/
	const pending = new WeakMap();

	return JSON.parse(source, function(key, value, context) {
		// Inside an array: stash the raw source text for numeric elements.
		if (Array.isArray(this) && (typeof value === 'number') && context?.source != undefined) {
			if (!pending.has(this)) {
				pending.set(this, []);
			}
			pending.get(this).push({ index: Number(key), src: context.source });
			return value; // will be replaced when the named key is visited
		}

		if (!bigIntKeys.has(key)) {
			return value;
		}

		try {
			// Scalar number: use context.source to preserve exact digits.
			if ((typeof value === 'number') && (context?.source != undefined)) {
				return BigInt(context.source);
			}
			// Array of numbers: apply the stashed sources.
			if (Array.isArray(value)) {
				pending.get(value)?.forEach(({ index, src }) => { value[index] = BigInt(src); });
				return value;
			}
			// Quoted integer string (e.g. "10711025630743843471").
			if ((typeof value === 'string') && /^-?\d+$/.test(value)) {
				return BigInt(value);
			}
		} catch (e) {
			console.error("Error converting to BigInt:", e, "key:", key, "value:", value);
		}

		return value;
	});
}
