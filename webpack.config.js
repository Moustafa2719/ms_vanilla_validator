const TerserPlugin = require("terser-webpack-plugin");

module.exports = (config, args) => {
    return {
        entry: [
            __dirname + "/src/js/validator.js"
        ],
        optimization: {
            minimize: args.mode == "production" ? true : false,
            minimizer: [
                new TerserPlugin({
                    minify: TerserPlugin.uglifyJsMinify,
                    terserOptions: {},
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "file-loader",
                            options: { outputPath: "js/", name: "[name].min.js" },
                        },
                    ],
                }
            ],
        }
    }
};