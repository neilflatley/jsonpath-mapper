import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'dist/index.js',
  context: 'this',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      // exports: 'named',
    },
    // {
    //   file: 'dist/esm/index.js',
    //   format: 'es',
    // },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        ['@babel/preset-env', { targets: { esmodules: true } }],
        ['@babel/preset-typescript'],
      ],
    }),
  ],
};
