import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';
// import { Camera } from '@capacitor/camera';
import { SplashScreen } from '@capacitor/splash-screen';
import { CapacitorIvsPlayer, pause, resume } from '@capgo/capacitor-ivs-player';

const SAMPLE_STREAM_URL =
  'https://d6hwdeiig07o4.cloudfront.net/ivs/956482054022/cTo5UpKS07do/2020-07-13T22-54-42.188Z/OgRXMLtq8M11/media/hls/master.m3u8';
const ENGINE_OVERLAY_ID = 'engine-demo-overlay';

function setEngineStatus(text) {
  const node = document.getElementById('engine-status');
  if (node) {
    node.textContent = text;
  }
}

async function reportPluginState(label) {
  try {
    const state = await CapacitorIvsPlayer.getState();
    setEngineStatus(`${label}:state=${state.state}`);
    return state;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setEngineStatus(`${label}:error=${message}`);
    throw error;
  }
}

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();
      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
        background-color: transparent;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      main {
        padding: 15px;
        background-color: white;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 546px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
      .controls {
        color: white;
        font-family: cursive;
        font-size: 50px;
        width: 100%;
        aspect-ratio: 16 / 9;
        border: -1px solid black;
        text-align: center;
        display: flex;
        align-items: center;
        justify-items: center;
        z-index: 99999999999;
        text-shadow: 2px 2px black;
      }
    </style>
    <div style="height: 100vh">
      <capacitor-welcome-titlebar>
        <h1>Capacitor</h1>
      </capacitor-welcome-titlebar>
      <div class="controls">
        Video Controls
      </div>
      <main>
        <p>
          Capacitor makes it easy to build powerful apps for the app stores, mobile web (Progressive Web Apps), and desktop, all
          with a single code base.
        </p>
        <h2>Getting Started</h2>
        <p>
          <button class="button" id="create-stream">Create Stream</button>
        </p>
        <p>
          <button class="button" id="start-stream">Start Stream</button>
        </p>
        <p>
          <button class="button" id="autostart-stream">AutoStart Stream</button>
        </p>
        <p>
          <button class="button" id="pause-stream">Pause Stream</button>
        </p>
        <p>
          <button class="button" id="delete-stream">Delete Stream</button>
        </p>
        <p>
          <button class="button" id="get-frame">Get frame</button>
        </p>
        <p>
          <button class="button" id="get-qualities">Get getQualities</button>
        </p>
        <p>
          <button class="button" id="toggle-pip">Toggle Pip</button>
        </p>
        <h2>Native UI Engine</h2>
        <p>
          <button class="button" data-testid="create-engine-off" id="create-engine-off">Create (engine off)</button>
        </p>
        <p>
          <button class="button" data-testid="create-engine-on" id="create-engine-on">Create (engine on)</button>
        </p>
        <p>
          <button class="button" data-testid="create-engine-invalid" id="create-engine-invalid">
            Create (engine on, missing selector)
          </button>
        </p>
        <p>
          <button class="button" data-testid="toggle-web-overlay" id="toggle-web-overlay">Toggle web overlay</button>
        </p>
        <p>
          <img id="image" style="max-width: 100%">
        </p>
      </main>
    </div>
    `;
    }

    connectedCallback() {
      const self = this;
      CapacitorIvsPlayer.addListener('expandPip', (res) => {
        console.log('expandPip', res);
      });
      CapacitorIvsPlayer.addListener('closePip', (res) => {
        console.log('closePip', res);
      });

      self.shadowRoot.querySelector('#toggle-pip').addEventListener('click', async function (e) {
        CapacitorIvsPlayer.getPip().then((res) => {
          console.log('getPip', res);
          CapacitorIvsPlayer.setPip({ pip: !res.pip });
        });
      });
      self.shadowRoot
        .querySelector('#autostart-stream')
        .addEventListener('click', async function (e) {
          await CapacitorIvsPlayer.create({ url: SAMPLE_STREAM_URL, autoPlay: true, toBack: true });
          await reportPluginState('autostart');
        });
      self.shadowRoot.querySelector('#start-stream').addEventListener('click', async function (e) {
        CapacitorIvsPlayer.start();
      });
      self.shadowRoot.querySelector('#pause-stream').addEventListener('click', async function (e) {
        CapacitorIvsPlayer.pause();
      });
      self.shadowRoot.querySelector('#create-stream').addEventListener('click', async function (e) {
        await CapacitorIvsPlayer.create({ url: SAMPLE_STREAM_URL, autoPlay: false, toBack: true });
        await reportPluginState('create-off');
      });
      self.shadowRoot.querySelector('#create-engine-off').addEventListener('click', async function () {
        await CapacitorIvsPlayer.create({ url: SAMPLE_STREAM_URL, autoPlay: false, toBack: true, nativeUiEngine: false });
        await reportPluginState('engine-off');
      });
      self.shadowRoot.querySelector('#create-engine-on').addEventListener('click', async function () {
        await CapacitorIvsPlayer.create({
          url: SAMPLE_STREAM_URL,
          autoPlay: true,
          toBack: true,
          nativeUiEngine: true,
          projectionSelector: '#ivs-player-slot',
        });
        await reportPluginState('engine-on');
      });
      self.shadowRoot.querySelector('#create-engine-invalid').addEventListener('click', async function () {
        try {
          await CapacitorIvsPlayer.create({
            url: SAMPLE_STREAM_URL,
            autoPlay: false,
            toBack: true,
            nativeUiEngine: true,
          });
          setEngineStatus('invalid:unexpected-success');
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          setEngineStatus(`invalid:rejected=${message}`);
        }
      });
      self.shadowRoot.querySelector('#toggle-web-overlay').addEventListener('click', async function () {
        const existing = document.getElementById(ENGINE_OVERLAY_ID);
        if (existing) {
          existing.remove();
          resume();
          await reportPluginState('overlay-dismissed');
          return;
        }
        pause();
        const overlay = document.createElement('div');
        overlay.id = ENGINE_OVERLAY_ID;
        overlay.setAttribute('data-testid', 'engine-web-overlay');
        overlay.style.cssText =
          'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;color:#fff;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:1.2rem;';
        overlay.textContent = 'Web overlay (tap to dismiss)';
        overlay.addEventListener('click', async () => {
          overlay.remove();
          resume();
          await reportPluginState('overlay-dismissed');
        });
        document.body.appendChild(overlay);
        await reportPluginState('overlay-open');
      });
      self.shadowRoot.querySelector('#delete-stream').addEventListener('click', async function (e) {
        CapacitorIvsPlayer.delete();
      });
      self.shadowRoot.querySelector('#get-frame').addEventListener('click', async function (e) {
        CapacitorIvsPlayer.getFrame().then((frame) => {
          console.log('frame', frame);
        });
      });
      self.shadowRoot.querySelector('#get-qualities').addEventListener('click', async function (e) {
        CapacitorIvsPlayer.getQualities().then((qualities) => {
          console.log('qualities', qualities);
        });
      });
    }
  },
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  },
);

if (Capacitor.isNativePlatform()) {
  CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('Capgo notifyAppReady failed', error);
  });
}
