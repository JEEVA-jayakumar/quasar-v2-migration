// Configuration for Inventory Portal
import { defineConfig } from '#q-app/wrappers'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig((ctx) => {
  return {
    boot: ['axios'],

    css: [
      'assets/css/style.css'
    ],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    build: {
      vueRouterMode: 'hash',
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node18'
      },
      vitePlugins: []
    },

    devServer: {
      open: true,
      port: 8081 // Different port from main portal
    },

    framework: {
      config: {
        brand: {
          primary: '#008080', // Inventory Teal
          secondary: '#26A69A',
          accent: '#9C27B0',
          dark: '#1D1D1D',
          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037'
        }
      },
      iconSet: 'material-icons',
      lang: 'en-US',
      importStrategy: 'auto',

      plugins: [
        'Notify',
        'Dialog',
        'Loading',
        'LocalStorage',
        'SessionStorage',
        'Cookies'
      ]
    },

    animations: []
  }
})
