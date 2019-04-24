import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'caiacc',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  copy: [
    { src: 'assets' },
    { src: 'studies' },
    { src: 'style.css' }
  ]
};
