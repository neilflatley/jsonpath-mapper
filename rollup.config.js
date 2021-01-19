import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
// import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
  input: 'dist/index.js',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      exports: 'named',
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
    }),
    // typescript({
    //   typescript: require('typescript'),
    // }),
  ],
};
