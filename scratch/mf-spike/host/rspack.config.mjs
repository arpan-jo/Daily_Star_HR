import * as Repack from '@callstack/repack';

// 10.0.2.2 is the emulator's route to the host machine. Physical device: LAN IP.
const REMOTE_HOST = process.env.MF_REMOTE_HOST ?? 'http://10.0.2.2:9000';

/**
 * Host: consumes the `todo` container. Re.Pack rewrites `remotes` into
 * ScriptManager-backed loaders, so `import('todo/TodoApp')` in app code just
 * works — no manual chunk resolver needed for the spike.
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
      name: 'host',
      remotes: {
        // [platform] is substituted per build — the remote serves one manifest
        // per platform, which is why a single URL works for android and ios.
        todo: `todo@${REMOTE_HOST}/[platform]/mf-manifest.json`,
      },
      shared: {
        react: {singleton: true, eager: true, requiredVersion: '19.2.3'},
        'react-native': {singleton: true, eager: true, requiredVersion: '0.84.0'},
      },
    }),
  ],
});
