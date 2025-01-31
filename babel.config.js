module.exports = {
	presets: ["@babel/preset-env", "@babel/preset-react"],
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
