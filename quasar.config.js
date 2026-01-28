// Configuration for your app
import { defineConfig } from '#q-app/wrappers'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig((ctx) => {
  return {
    boot: ['axios'],

    css: [
      // 'app.scss', // Add this - it's required
      'assets/css/style.css'
    ],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    build: {
      vueRouterMode: 'hash',
      
      // Simplify target for compatibility
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node18'
      },

      // Remove vite-plugin-checker - it's causing issues
      vitePlugins: []
    },

    devServer: {
      open: true,
      port: 8080
    },

    framework: {
      config: {
        brand: {
          primary: '#1976D2',
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
      
      // IMPORTANT: Add auto-import
      importStrategy: 'auto',
      
      // Add components you actually use
      components: [
        'QBtn',
        'QIcon',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QInput',
        'QSelect',
        'QForm',
        'QTable',
        'QTr',
        'QTd',
        'QTh',
        'QPage',
        'QPageContainer',
        'QHeader',
        'QFooter',
        'QDrawer',
        'QToolbar',
        'QToolbarTitle',
        'QSpace',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QAvatar',
        'QBadge',
        'QCheckbox',
        'QRadio',
        'QToggle',
        'QSlider',
        'QRange',
        'QDate',
        'QTime',
        'QPopupProxy',
        'QMenu',
        'QDialog',
        'QSpinner',
        'QCircularProgress',
        'QLinearProgress',
        'QSeparator',
        'QExpansionItem',
        'QTree',
        'QEditor',
        'QFile',
        'QUploader',
        'QVideo',
        'QCarousel',
        'QCarouselSlide',
        'QParallax',
        'QTimeline',
        'QTimelineEntry',
        'QChatMessage',
        'QScrollArea',
        'QInfiniteScroll',
        'QVirtualScroll'
      ],
      
      // Add directives you use
      directives: [
        'Ripple',
        'ClosePopup',
        'TouchSwipe',
        'TouchHold',
        'TouchPan',
        'TouchRepeat',
        'Intersection'
      ],
      
      // Add plugins you use
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