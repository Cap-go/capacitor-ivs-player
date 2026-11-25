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

test('projection setup stays behind nativeUiEngine (iOS)', () => {
  assert.match(swift, /let enableEngine = call\.getBool\("nativeUiEngine", false\)/);
  assert.match(swift, /teardownNativeUiEngine\(\)/);
});

test('Android engine channel install is gated behind nativeUiEngine setup', () => {
  assert.match(java, /if \(!nativeUiEngineChannelInstalled\)/);
  assert.match(java, /boolean enableEngine = call\.getBoolean\("nativeUiEngine", false\)/);
  assert.match(java, /if \(nativeUiEngineEnabled && projection != null\)/);
});