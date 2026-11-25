# Capgo website patch: IVS player Native UI Engine

Add under https://capgo.app/docs/plugins/ivs-player/

## create() options

| Option | Default | Description |
| --- | --- | --- |
| `nativeUiEngine` | `false` | Opt in to `@webview-native-ui/engine` for DOM-aligned player placement and web overlays. |
| `projectionSelector` | (none) | Required when `nativeUiEngine` is `true`. CSS selector for the DOM slot (document tree, not shadow DOM). |

## Web overlays and frozen video

Live IVS playback does not continue inside the Web projection. When web UI covers the player (via `pause()` or Ionic overlays), the Engine shows a **snapshot** of the native frame in `projectionSelector`. Playback looks frozen until `resume()` restores the native view.

For Ionic modals and overlays, call `enableSupportIonicOverlays()` from `@webview-native-ui/engine/ionic` during app bootstrap (once per WebView).

```ts
import { CapacitorIvsPlayer, pause, resume } from '@capgo/capacitor-ivs-player';

await CapacitorIvsPlayer.create({
  url,
  toBack: true,
  nativeUiEngine: true,
  projectionSelector: '#ivs-player-slot',
});

pause();
try {
  await openModal();
} finally {
  resume();
}
```

## CocoaPods

```ruby
pod 'WebViewNativeUIEngine', :path => '../../node_modules/@webview-native-ui/engine'
```