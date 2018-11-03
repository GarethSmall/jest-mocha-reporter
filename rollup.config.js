import babel from 'rollup-plugin-babel';
import flow from 'rollup-plugin-flow';
import { eslint } from 'rollup-plugin-eslint';
import pkg from './package.json';

export default [
  // CommonJS
  {
    input: 'src/index.js',
    output: {
      file: 'dist/jest-mocha-reporter.js',
      format: 'cjs',
      indent: false,
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
    ],
    plugins: [
      eslint(),
      flow(),
      babel(),
    ]
  },
];
