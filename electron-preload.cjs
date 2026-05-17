// Simple preload to keep contextIsolation on and allow future bridging
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('TasarrOMSAdmin', {
  version: '1.0.0',
});

