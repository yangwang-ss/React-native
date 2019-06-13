module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['src'],
        extensions: ['.ios.js', '.android.js', '.js', '.json'],
        alias: {
          '@components': './src/components',
          '@assets': './assets',
          '@api': './src/services/api',
          '@constants': './src/constants',
          '@utils': './src/utils',
        },
      },
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
