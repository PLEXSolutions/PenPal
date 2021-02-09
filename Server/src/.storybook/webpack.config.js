/*

Webpack setup

Adapt with your own loaders and config if necessary

*/

const path = require("path");
const webpack = require("webpack");

module.exports = ({ config }) => {
  // Define aliases. Allow to mock some packages.
  config.resolve = {
    ...config.resolve,
    // this way node_modules are always those of current project and not of Vulcan
    alias: {
      ...config.resolve.alias,
      // Other packages
      "meteor/apollo": path.resolve(__dirname, "./mocks/meteor-apollo"),
      "meteor/server-render": path.resolve(
        __dirname,
        "./mocks/meteor-server-render"
      ),
      "meteor/penpal": path.resolve(
        __dirname,
        "../packages/penpal/penpal-client.js"
      ),
      plugins: path.resolve(__dirname, "../plugins/"),
      stories: path.resolve(__dirname, "../stories/")
    }
  };

  // Mock global variables
  config.plugins.push(
    new webpack.ProvidePlugin({
      // mock global variables
      Meteor: path.resolve(__dirname, "./mocks/Meteor"),
      Mongo: path.resolve(__dirname, "./mocks/Mongo"),
    })
  );

  // force the config to use local node_modules
  // Should not be modified
  config.resolve.modules.push(path.resolve(__dirname, "../node_modules"));

  // Add the node modules from the PenPal meteor package
  config.resolve.modules.push(
    path.resolve(__dirname, "../packages/penpal/.npm/package/node_modules")
  );

  // handle meteor packages
  // Add your custom loaders here if necessary
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loaders: [
      // Remove meteor package (last step)
      {
        loader: "scrap-meteor-loader",
        options: {
          // those package will be preserved, we provide a mock instead
          preserve: ["meteor/apollo", "meteor/server-render", "meteor/penpal"]
        }
      },
      {
        loader: path.resolve(__dirname, "./loaders/starter-example-loader"),
        options: {
          packagesDir: path.resolve(__dirname, "../packages"),
          environment: "client"
        }
      }
    ]
  });

  // Parse JSX files outside of Storybook directory
  // Should not be modified
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    loaders: [
      {
        loader: "babel-loader",
        query: {
          presets: [
            "@babel/react",
            {
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-syntax-dynamic-import"
              ]
            }
          ]
        }
      }
    ]
  });

  // Parse SCSS files
  // Should not be modfied
  config.module.rules.push({
    test: /\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"]
    // include: path.resolve(__dirname, "../")
  });

  // Return the altered config
  return config;
};
