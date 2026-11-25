import assert from 'node:assert/strict';
import test from 'node:test';

const { PROJECTION_SELECTOR_REQUIRED, usesNativeUiEngine, validateCapacitorIvsPlayerCreateOptions } =
  await import('../dist/esm/create-options.js');

test('create() defaults: nativeUiEngine off leaves legacy path unchanged', () => {
  const options = { url: 'https://example.test/stream.m3u8', autoPlay: false, toBack: true };
  assert.equal(usesNativeUiEngine(options), false);
  assert.doesNotThrow(() => validateCapacitorIvsPlayerCreateOptions(options));
});

test('create() with nativeUiEngine true requires projectionSelector', () => {
  const options = {
    url: 'https://example.test/stream.m3u8',
    autoPlay: true,
    toBack: true,
    nativeUiEngine: true,
    projectionSelector: '#ivs-player-slot',
  };
  assert.equal(usesNativeUiEngine(options), true);
  assert.doesNotThrow(() => validateCapacitorIvsPlayerCreateOptions(options));
});

test('create() error handling when nativeUiEngine true without projectionSelector', () => {
  const options = {
    url: 'https://example.test/stream.m3u8',
    autoPlay: false,
    toBack: true,
    nativeUiEngine: true,
  };
  assert.throws(() => validateCapacitorIvsPlayerCreateOptions(options), (error) => {
    assert.ok(error instanceof Error);
    assert.equal(error.message, PROJECTION_SELECTOR_REQUIRED);
    return true;
  });
});