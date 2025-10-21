import Blits from '@lightningjs/blits'
import App from './App.js'
import './styles/globals.css' // Global styles include focus-visible outlines, background, and base reset

Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  debugLevel: 1,
})
