const path = require("path");
const fs = require("fs");
const webpack = require("webpack")

// https://github.com/winwiz1/crisp-react/blob/master/client/webpack.config.js

// Supress "Failed to load tsconfig.json: Missing baseUrl in compilerOptions" error message.
// Details: https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/17
delete process.env.TS_NODE_PROJECT;

const getWebpackConfig = (env, argv) => {
  const isProduction = (env && env.prod) ? true : false;

  const config = {
    mode: isProduction ? "production" : "development",
    devtool: "source-map",
    entry: ["./src/client.ts"],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                happyPackMode: true,
                configFile: path.resolve(__dirname, "tsconfig.json"),
              },
            }
          ],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      filename: "client.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      crossOriginLoading: "anonymous",
    },
    
    devServer: {
      index: "/index.html",
      publicPath: "/",
      contentBase: path.join(__dirname, "static_files"),
      compress: false,
      hot: false,
      inline: false,
      host: "0.0.0.0",
      port: 4000,
      writeToDisk: false
     
    },
    context: path.resolve(__dirname),
  };

  
 return config;
}

module.exports = getWebpackConfig;