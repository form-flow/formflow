const path = require('path');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials', // actions,backgrounds,controls,docs,viewport,toolbars,measure,outline
    '@storybook/addon-interactions',
    '@storybook/addon-a11y'
  ],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType: string }) => { // configType: 'DEVELOPMENT' or 'PRODUCTION'
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  },
}