const path = require("path");
// Check if NODE_ENV is passed
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "production";

console.log(`Running on ${env} mode`);

module.exports = {
    mode: env,
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build/js")
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};
