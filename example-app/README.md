## Created with Capacitor Create App

This app was created using [`@capacitor/create-app`](https://github.com/ionic-team/create-capacitor-app/),
and comes with a very minimal shell for building an app.

### Running this example

```bash
bun install
bun run build
bun run start
```

### Sync iOS (Native UI Engine)

From `example-app/`:

```bash
bun install
bun run build
bunx cap sync ios
```

CocoaPods layouts also need the engine pod in `ios/App/Podfile` (see the plugin README).

### Maestro (engine flows)

Build and install the native app on a simulator or device first, then from `example-app/`:

```bash
maestro test .maestro/engine-off-create.yaml
maestro test .maestro/engine-on-invalid.yaml
maestro test .maestro/engine-on-overlay.yaml
```

Or all flows:

```bash
maestro test .maestro/
```