// Simple preload to keep contextIsolation on and allow future bridging
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('LarabaseKitDesktop', {
  version: '1.0.0',
});

