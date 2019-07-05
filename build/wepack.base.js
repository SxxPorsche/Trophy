/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (modeConfigs) => ({
  mode: modeConfigs.mode,
  entry: modeConfigs.entry,
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    ...modeConfigs.output,
  },
  optimization: modeConfigs.optimization,
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // Transform all .js files required somewhere with Babel
        loader: 'babel-loader',
        exclude: [/node_modules/, /ytx/],
        options: modeConfigs.babelOptions,
      },
      {
        test: /\.css/,
        exclude: /node_modules/,
        use: [
          {
            loader: options.cssDebug ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: options.cssDebug,
              modules: true,
              localIdentName: options.cssDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              minimize: !options.cssDebug,
              discardComments: { removeAll: true },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                // Transfer @global-import rule by inlining content with :global CSS Modules scope
                // e.g. @global-import 'draft-js/dist/Draft.css'
                // https://github.com/scherebedov/postcss-global-import
                postcssGlobalImport(),
                // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
                // https://github.com/postcss/postcss-import
                postcssImport({ path: 'src' }),
                // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
                // https://github.com/postcss/postcss-custom-properties
                postcssMixins(),
                postcssCustomProperties(),
                // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
                // https://github.com/postcss/postcss-custom-media
                postcssCustomMedia(),
                // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
                // https://github.com/postcss/postcss-media-minmax
                postcssMediaMinmax(),
                // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
                // https://github.com/postcss/postcss-custom-selectors
                postcssCustomSelectors(),
                // W3C calc() function, e.g. div { height: calc(100px - 2em); }
                // https://github.com/postcss/postcss-calc
                postcssCalc(),
                // Allows you to nest one style rule inside another
                // https://github.com/jonathantneal/postcss-nesting
                postcssNesting(),
                // Unwraps nested rules like how Sass does it
                // https://github.com/postcss/postcss-nested
                postcssNested(),
                // W3C color() function, e.g. div { background: color(red alpha(90%)); }
                // https://github.com/postcss/postcss-color-function
                postcssColorFunction(),
                // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
                // https://github.com/iamvdo/pleeease-filters
                pleeeaseFilters(),
                // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
                // https://github.com/robwierzbowski/node-pixrem
                pixrem(),
                // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
                // https://github.com/postcss/postcss-selector-matches
                postcssSelectorMatches(),
                // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
                // https://github.com/postcss/postcss-selector-not
                postcssSelectorNot(),
                // Postcss flexbox bug fixer
                // https://github.com/luisrudge/postcss-flexbugs-fixes
                postcssFlexbugsFixes(),
                // Add vendor prefixes to CSS rules using values from caniuse.com
                // https://github.com/postcss/autoprefixer
                autoprefixer(/* package.json/browserslist */),
              ],
            },
          },
        ],
      },
      {
        // custom Ant Design theme
        test: /\.less$/,
        use: [
          {
            loader: options.cssDebug ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()],
            },
          },
          {
            loader: `less-loader?{"sourc2eMap":true,"modifyVars":${JSON.stringify(themer)}}`,
          },
        ],
      },
      {
        test: /\.(wav|eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loaders: [
          'file-loader',
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     optipng: {
          //       optimizationLevel: 7,
          //     },
          //     gifsicle: {
          //       interlaced: false,
          //     },
          //     mozjpeg: {
          //       progressive: true,
          //     },
          //     pngquant: {
          //       // full quality
          //       quality: 100,
          //     },
          //   },
          // },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.md$/,
        loaders: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
              gfm: true,
              tables: true,
              // highlight: (code) => highlight.highlightAuto(code).value,
            },
          },
        ],
      },
    ],
  }
});
