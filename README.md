# JynXS: A tiny custom JSX Runtime

JynXS is a lightweight, ~3KB JSX runtime that implements the very basics of a modern UI library without relying on
React.

> This project is very experimental and a proof of concept. Not recommended for production use.

## Core Features

- Custom JSX runtime implementation
- Supports functional components (only)
- Supports async components, also with a `fallback`. It means you don't need to wrap your components in `Suspense`.
- Basic hooks implementation:
  - `useState` for state management
  - `useEffect` for side effects
- Event handling
- Supports `ref` as prop, to access DOM elements
- TypeScript support

### TO-DO

- [ ] Support both `class` and `className`, and integrate with `clsx`, so arrays and conditional classes are supported.
- [ ] Add a `useGlobalState` hook to manage and subscribe to global state in a very simple way
- [ ] Better HTML attribute types
- [ ] Add SSR compatibility
- [ ] Support and handle sync/async functions in form's `action`: `(data: FormData) => Promise<void>`
- [ ] Implement `cache()` to avoid expensive tasks on re-renders

We won't add support for more complex features like advanced context, portals, style objects, custom hooks, etc.

## Getting Started

1. Install the package with any package manager:

   ```
   pnpm add jynxs
   # or
   npm install jynxs
   # or
   bun add jynxs
   ```

2. Configure your `tsconfig.json` to use the JynXS runtime:

   ```json
   {
     "compilerOptions": {
       "jsx": "react-jsx",
       "jsxImportSource": "jynxs"
     }
   }
   ```

3. Configure your Vite project to transpile JSX with esbuild:

   ```ts
   // vite.config.ts
   import { defineConfig } from 'vite'

   export default defineConfig({
     // ...
     esbuild: {
       jsxFactory: 'jsx',
       jsxFragment: 'Fragment',
     },
     // ...
   })
   ```

That's it!

## Usage Example

An example of how to use the JynXS runtime can be found in [`src/example.tsx`](./src/example.tsx).

This file demonstrates the usage of functional components, async components, state management, effects, and event
handling.

## Building for Production

To create a production build:

```
pnpm build
```

## Technologies Used

- Vite + esbuild
- Custom JSX Runtime
- TypeScript

No Babel or Webpack needed to transpile the JSX, esbuild is used instead.

## License

[MIT License](LICENSE)
