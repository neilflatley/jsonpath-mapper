import typescriptPlugin from '@rollup/plugin-typescript';
import dtsPlugin from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/jsonpath-mapper.cjs.js',
        format: 'cjs',
        // exports: 'named',
      },
      {
        file: 'dist/jsonpath-mapper.js',
        format: 'es',
      },
      {
        file: 'dist/jsonpath-mapper.mjs',
        format: 'es',
      },
    ],
    external: ['jsonpath-plus'],
    plugins: [typescriptPlugin()],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/jsonpath-mapper.d.ts', format: 'es' }],
    plugins: [dtsPlugin()],
  },
];
