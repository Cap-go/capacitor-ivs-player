import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const swift = readFileSync(
  new URL('../ios/Sources/CapacitorIvsPlayerPlugin/CapacitorIvsPlayerPlugin.swift', import.meta.url),
  'utf8',
);
const java = readFileSync(
  new URL('../android/src/main/java/ee/forgr/ivsplayer/CapacitorIvsPlayerPlugin.java', import.meta.url),
  'utf8',
);

test('notifyListeners forwards to projection only when nativeUiEngine is enabled (iOS)', () => {
  assert.match(swift, /if nativeUiEngineEnabled \{\s*projection\?\.receive/);
  assert.match(swift, /import WebViewNativeUIEngine/);
});

test('projection setup stays behind nativeUiEngine flag in create() (iOS)', () => {
  assert.match(
    swift,
    /DispatchQueue\.main\.async \{[\s\S]*if !enableEngine \{[\s\S]*teardownNativeUiEngine\(\)/,
  );
  assert.match(
    swift,
    /if !self\.setupNativeUiEngine\(projectionSelector: selector\) \{[\s\S]*call\.reject\("Native UI projection unavailable"\)/,
  );
});

test('Android engine channel install is gated on capacitor.config nativeUiEngine', () => {
  assert.match(java, /boolean configNativeUiEngine = getConfig\(\)\.getBoolean\("nativeUiEngine", false\)/);
  assert.match(
    java,
    /if \(configNativeUiEngine && !nativeUiEngineChannelInstalled\) \{[\s\S]*NativeUIProjection\.Companion\.install\(bridge\.getWebView\(\)\)/,
  );
});

test('iOS attaches playerView before Native UI projection setup', () => {
  assert.match(swift, /ensurePlayerViewAttachedForNativeUi\(toBack: self\.toBack\)/);
  assert.match(
    swift,
    /_ = self\.ensurePlayerViewAttachedForNativeUi\(toBack: self\.toBack\)[\s\S]*if !self\.setupNativeUiEngine\(projectionSelector: selector\)/,
  );
});

test('Android projection setup stays behind nativeUiEngine flag in create()', () => {
  assert.match(
    java,
    /runOnUiThread\([\s\S]*if \(!enableEngine\) \{[\s\S]*teardownNativeUiEngine\(\)/,
  );
  assert.match(
    java,
    /if \(!setupNativeUiEngine\(projectionSelector\)\) \{[\s\S]*call\.reject\("Native UI projection unavailable"\)/,
  );
  assert.match(java, /if \(nativeUiEngineEnabled && projection != null\)/);
});