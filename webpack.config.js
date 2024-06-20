const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ensure file-loader is configured
  config.module.rules.push({
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  });

  return config;
};
