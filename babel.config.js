module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				modules: "commonjs", // Keep CJS output for published `dist/`
				targets: {
					esmodules: true, // Targeting modern environments that support ESModules
				},
				shippedProposals: true, // Allows modern (proposed/not widely implemented) features like BigInt regardless the environment
			}
		],
		[
			"@babel/preset-react",
			{
				// Babel 8 default; force production JSX helpers in published `dist/`.
				runtime: "automatic",
				development: false,
			}
		]
	],
	plugins: [
		"@babel/plugin-transform-runtime",
		[
			"module-resolver",
			{
				alias: {
					"@components": "./src/components" // This is to resolve path to exported components of asab shell
				},
				extensions: [".js", ".jsx"],
				resolvePath: (sourcePath) => {
					if (sourcePath.endsWith(".jsx")) {
						return sourcePath.replace(".jsx", ".js");
					}
					return sourcePath;
				}
			}
		]
	]
};
