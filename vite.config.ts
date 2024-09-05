import { defineConfig } from 'vite'

export default defineConfig({
  base: '/jynxs/',
  esbuild: {
    // jsxInject: `import { jsx } from '@app/runtime/jsx-runtime'`, // apparently not needed
    jsxFactory: 'jsx',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: {
      '@app': '/src',
    },
  },
})
