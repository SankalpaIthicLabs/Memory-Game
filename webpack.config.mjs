import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development", 
  entry: "./src/config.js", 
  output: {
    filename: "bundle.min.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: "./dist",
    port: 8080,
    open: true,
  },
  optimization: {
    minimize: true, 
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true, 
        },
        format: {
          comments: false, 
        },
      },
      extractComments: false, 
    })],
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        use: ["style-loader", "css-loader"], 
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html", 
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "assets", to: "assets" }], 
    }),
  ],
};