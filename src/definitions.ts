interface CapacitorFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface PluginListenerHandle {
  remove: () => Promise<void>;
}
export type CapacitorIvsPlayerState = 'IDLE' | 'BUFFERING' | 'READY' | 'PLAYING' | 'ENDED' | 'UNKNOWN';
export type CapacitorIvsPlayerBackgroundState = 'PAUSED' | 'PLAYING';

interface CapacitorIvsPlayerCreateOptionsBase {
  url: string;
  pip?: boolean;
  title?: string;
  subtitle?: string;
  cover?: string;
  autoPlay?: boolean;
  toBack?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export type CapacitorIvsPlayerCreateOptions =
  | (CapacitorIvsPlayerCreateOptionsBase & {
      /**
       * @default false
       * @since 8.0.48
       */
      nativeUiEngine?: false;
      /**
       * @since 8.0.48
       */
      projectionSelector?: string;
    })
  | (CapacitorIvsPlayerCreateOptionsBase & {
      /**
       * Connect the native IVS player to a DOM slot via `@webview-native-ui/engine` so web UI can cover it
       * or keep it aligned with scrolling layout. While a web overlay covers the player, live video does not
       * continue in the Web layer: the Engine shows a frozen snapshot until you call `resume()` from this package.
       *
       * @since 8.0.48
       */
      nativeUiEngine: true;
      /**
       * CSS selector for the DOM container that receives the player Web projection.
       * Must match one element in the document (not inside a closed shadow root).
       *
       * @since 8.0.48
       */
      projectionSelector: string;
    });

export interface CapacitorIvsPlayerPlugin {
  create(options: CapacitorIvsPlayerCreateOptions): Promise<void>;
  start(): Promise<void>;
  cast(): Promise<void>;
  getCastStatus(): Promise<{ isActive: boolean }>;
  pause(): Promise<void>;
  delete(): Promise<void>;
  getUrl(): Promise<{ url: string }>;
  getState(): Promise<{ state: CapacitorIvsPlayerState }>;
  setPlayerPosition(options?: { toBack: boolean }): Promise<void>;
  getPlayerPosition(): Promise<{ toBack: boolean }>;
  setAutoQuality(options?: { autoQuality?: boolean }): Promise<void>;
  getAutoQuality(): Promise<{ autoQuality: boolean }>;
  setPip(options?: { pip?: boolean }): Promise<void>;
  getPip(): Promise<{ pip: boolean }>;
  /**
   * Set the frame of the player view, all number have to be positive and integers
   * @param options {x: number, y: number, width: number, height: number}
   * @returns
   * @since 1.0.0
   */
  setFrame(options?: { x?: number; y?: number; width?: number; height?: number }): Promise<void>;
  getFrame(): Promise<CapacitorFrame>;
  setBackgroundState(options: { backgroundState: CapacitorIvsPlayerBackgroundState }): Promise<void>;
  getBackgroundState(): Promise<{
    backgroundState: CapacitorIvsPlayerBackgroundState;
  }>;
  setMute(options?: { muted?: boolean }): Promise<void>;
  getMute(): Promise<{ mute: boolean }>;
  setQuality(options?: { quality: string }): Promise<void>;
  getQuality(): Promise<{ quality: string }>;
  getQualities(): Promise<{ qualities: string[] }>;

  /**
   * Get the native Capacitor plugin version
   *
   * @returns {Promise<{ id: string }>} an Promise with version for this device
   * @throws An error if the something went wrong
   */
  getPluginVersion(): Promise<{ version: string }>;
  /**
   * Listen for start pip
   *
   * @since 1.0.0
   */
  addListener(eventName: 'startPip', listenerFunc: () => void): Promise<PluginListenerHandle>;
  /**
   * Listen for stop pip
   *
   * @since 1.0.0
   */
  addListener(eventName: 'stopPip', listenerFunc: () => void): Promise<PluginListenerHandle>;
  /**
   * Listen for expend pip
   *
   * @since 1.0.0
   */
  addListener(eventName: 'expandPip', listenerFunc: () => void): Promise<PluginListenerHandle>;
  /**
   * Listen for close pip
   *
   * @since 1.0.0
   */
  addListener(eventName: 'closePip', listenerFunc: () => void): Promise<PluginListenerHandle>;
  /**
   * Listen for state changes
   *
   * @since 1.0.0
   */
  addListener(
    eventName: 'onState',
    listenerFunc: (data: { state: CapacitorIvsPlayerState }) => void,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen for cue changes
   *
   * @since 1.0.0
   */
  addListener(eventName: 'onCues', listenerFunc: (data: { cues: string }) => void): Promise<PluginListenerHandle>;
  /**
   * Listen for duration changes
   *
   * @since 1.0.0
   */
  addListener(
    eventName: 'onDuration',
    listenerFunc: (data: { duration: number }) => void,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen for errors
   *
   * @since 1.0.0
   */
  addListener(eventName: 'onError', listenerFunc: (data: { error: string }) => void): Promise<PluginListenerHandle>;
  /**
   * Listen for rebuffering
   *
   * @since 1.0.0
   */
  addListener(eventName: 'onRebuffering', listenerFunc: () => void): Promise<PluginListenerHandle>;
  /**
   * Listen for position changes
   *
   * @since 1.0.0
   */
  addListener(
    eventName: 'onSeekCompleted',
    listenerFunc: (data: { position: number }) => void,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen for video size changes
   *
   * @since 1.0.0
   */
  addListener(
    eventName: 'onVideoSize',
    listenerFunc: (data: { width: number; height: number }) => void,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen for quality changes
   *
   * @since 1.0.0
   */
  addListener(eventName: 'onQuality', listenerFunc: (data: { quality: string }) => void): Promise<PluginListenerHandle>;
  /**
   * Listen for cast status changes
   *
   * @since 1.0.0
   */
  addListener(
    eventName: 'onCastStatus',
    listenerFunc: (data: { isActive: boolean }) => void,
  ): Promise<PluginListenerHandle>;
  /**
   * Remove all listeners for this plugin.
   *
   * @since 1.0.0
   */
  removeAllListeners(): Promise<void>;
}
