// metro.config.js

const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  defaultConfig.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];
  return defaultConfig;
})();
