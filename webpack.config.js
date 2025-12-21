// Generated using webpack-cli https://github.com/webpack/webpack-cli

// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

require("dotenv").config({
  path: path.join(
    process.cwd(),
    process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env"
  ),
});

const isProduction = process.env.NODE_ENV === "production";
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./src/index.ts",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    open: true,
    host: "localhost",
    watchFiles: ["src/pages/*.html"],
    hot: true,

    // Serve static assets like /favicon.ico, /manifest.json from /public
    // Put those files into ./public to avoid 404s.
    static: {
      directory: path.join(__dirname, "public"),
    },

    // Proxy DeepL to avoid CORS in browser:
    // Frontend calls: /api/deepl/v2/translate
    // Dev server forwards to: https://api-free.deepl.com/v2/translate
    proxy: {
      "/api/deepl": {
        target: "https://api-free.deepl.com",
        changeOrigin: true,
        secure: true,
        pathRewrite: { "^/api/deepl": "" },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/pages/index.html",
    }),

    new MiniCssExtractPlugin(),

    new DefinePlugin({
      "process.env.DEVELOPMENT": JSON.stringify(!isProduction),
      "process.env.API_ORIGIN": JSON.stringify(process.env.API_ORIGIN ?? ""),
      // Needed for Api.ts:
      "process.env.DEEPL_AUTH_KEY": JSON.stringify(process.env.DEEPL_AUTH_KEY ?? ""),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: [
    "babel-loader",
    {
      loader: "ts-loader",
      options: {
        transpileOnly: true
      }
    }
  ],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: ["src/scss"],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
};

module.exports = () => {
  config.mode = isProduction ? "production" : "development";
  return config;
};
