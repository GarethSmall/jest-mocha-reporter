const {NODE_ENV} = process.env;

const presets = [
  [
    '@babel/env',
    {
      targets: {
        browsers: ['ie >= 11']
      },
      modules: false,
      loose: true
    }
  ],
  '@babel/preset-flow',
];

const plugins = [
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/proposal-object-rest-spread',
];

if (NODE_ENV === 'test') {
  plugins.push('@babel/transform-modules-commonjs');
}

module.exports = {
  presets,
  plugins,
};
