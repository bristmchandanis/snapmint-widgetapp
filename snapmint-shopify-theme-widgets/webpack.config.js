const path = require("path");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "snapmint-widgets.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: { extensions: [".js", ".jsx"] },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // or your actual output directory
    },
    allowedHosts: "all", // or use ['.ngrok.io'] if needed
    host: "0.0.0.0", // Allow external access
    port: 3000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  },
  devtool: "source-map",
};
