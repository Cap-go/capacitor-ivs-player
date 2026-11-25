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
    /let enableEngine = call\.getBool\("nativeUiEngine", false\)[\s\S]*if !enableEngine \{[\s\S]*teardownNativeUiEngine\(\)/,
  );
  assert.match(
    swift,
    /if !setupNativeUiEngine\(projectionSelector: selector\) \{[\s\S]*call\.reject\("Native UI projection unavailable"\)/,
  );
});

test('Android engine channel is installed from load()', () => {
  assert.match(
    java,
    /public void load\(\) \{[\s\S]*NativeUIProjection\.Companion\.install\(bridge\.getWebView\(\)\)/,
  );
});

test('Android projection setup stays behind nativeUiEngine flag in create()', () => {
  assert.match(
    java,
    /boolean enableEngine = call\.getBoolean\("nativeUiEngine", false\);[\s\S]*if \(!enableEngine\) \{[\s\S]*teardownNativeUiEngine\(\)/,
  );
  assert.match(
    java,
    /if \(!setupNativeUiEngine\(projectionSelector\)\) \{[\s\S]*call\.reject\("Native UI projection unavailable"\)/,
  );
  assert.match(java, /if \(nativeUiEngineEnabled && projection != null\)/);
});