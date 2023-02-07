const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (config, args) => {
    return {
        entry: [
            __dirname + "/src/scss/main.scss",
            __dirname + "/src/js/site.js",
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
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: { outputPath: "css/", name: "[name].min.css" },
                        },
                        "sass-loader",
                    ],
                }
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: __dirname + "/src/fonts",
                        to: __dirname + "/dist/fonts"
                    }
                ],
            }),
        ],
    }
};