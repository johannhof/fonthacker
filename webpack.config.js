var path = require("path");
var webpack = require("webpack");

module.exports = {
    devtool: "eval",
    entry: [
      "webpack-dev-server/client?http://localhost:8080",
      "webpack/hot/only-dev-server",
      "./src/index"
    ],
    devServer: {
      contentBase: "./playground/",
      hot: true,
      colors: true,
      progress: true,
      historyApiFallback: true
    },
    output: {
      path: path.join(__dirname, "playground"),
      filename: "fontmarklet.js"
    },
    resolve: {
      extensions: ["", ".js", ".jsx", ".json"]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            { test: /\.json$/, loader: "json-loader"},
            {
              test: /\.jsx?$/,
              loaders: ["react-hot", "babel"],
              include: path.join(__dirname, "src")
            }
        ]
    }
};

