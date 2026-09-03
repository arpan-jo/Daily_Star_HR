import * as Repack from '@callstack/repack';

/**
 * Remote: exposes ./TodoApp as the container `todo`.
 *
 * Everything except the ModuleFederationPluginV2 block is what
 * `@callstack/repack-init` generates — keep the generated version if it drifts.
 */
export default Repack.defineConfig({
  context: import.meta.dirname,
  entry: './index.js',
  resolve: {
    ...Repack.getResolveOptions(),
  },
  module: {
    rules: [
      ...Repack.getJsTransformRules(),
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    new Repack.RepackPlugin(),
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'todo',
      // Nothing else is public. A remote's export surface is its API.
      exposes: {
        './TodoApp': './src/TodoApp.tsx',
      },
      // Both MUST be singletons: two copies of React = "Invalid hook call" the
      // moment the remote renders. eager:false so the host's copy wins.
      shared: {
        react: {singleton: true, eager: false, requiredVersion: '19.2.3'},
        'react-native': {singleton: true, eager: false, requiredVersion: '0.84.0'},
      },
    }),
  ],
});
