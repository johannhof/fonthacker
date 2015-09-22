var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: [
      "./src/index"
    ],
    output: {
      path: path.join(__dirname, "build"),
      filename: "fontmarklet.min.js"
    },
    resolve: {
      extensions: ["", ".js", ".jsx", ".json"]
    },
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

