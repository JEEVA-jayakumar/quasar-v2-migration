import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginImport from 'eslint-plugin-import'

export default [
  // Base configuration for all JS/Vue files
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        // Your custom globals from .eslintrc.js
        ga: 'readonly',
        cordova: 'readonly',
        __statics: 'readonly'
      }
    },
    rules: {
      // Base recommended rules
      ...js.configs.recommended.rules,

      // Your custom rules from .eslintrc.js
      'generator-star-spacing': 'off',
      'arrow-parens': 0,
      'one-var': 0,
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      // Updated no-unused-vars rule from your config
      'no-unused-vars': ['error', {
        args: 'none',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }]
    }
  },

  // Import plugin configuration
  {
    plugins: {
      import: pluginImport
    },
    rules: {
      'import/first': 0,
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/extensions': 0,
      'import/no-unresolved': 0,
      'import/no-extraneous-dependencies': 0
    }
  },

  // Vue.js configuration (replaces plugin:vue/essential)
  ...pluginVue.configs['flat/essential'],

  // Override for minified files (from your overrides section)
  {
    files: ['**/*.min.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-prototype-builtins': 'off'
    }
  },

  // Ignore patterns - MUST BE LAST
  {
    ignores: [
      'node_modules/',
      'dist/',
      '*.min.js',
      '**/pdfobject.min.js',
      '**/assets/js/*.min.js',
      // Additional common ignores
      'coverage/',
      '*.log',
      '.quasar/',
      'public/'
    ]
  }
]
