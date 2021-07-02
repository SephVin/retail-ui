module.exports = {
  addons: ['creevey', '@storybook/addon-essentials', '@storybook/addon-links/register'],
  stories: ['../components/**/*.stories.tsx', '../internal/**/*.stories.tsx'],
  typescript: {
    reactDocgen: 'none',
  },
  features: {
    postcss: false,
  },
};
