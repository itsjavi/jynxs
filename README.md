# JynXS: A tiny custom JSX Runtime

JynXS is a lightweight, JSX runtime that implements the very basics of a modern UI library without relying on React.

> This project is very experimental and a proof of concept. Not recommended for production use.

> It will be released on NPM as soon as it's more stable and tested.

## Core Features

- Custom JSX runtime implementation
- Supports functional components (only)
- Supports async components, also with a `fallback`.
- Basic hooks implementation:
  - `useState` for state management
  - `useEffect` for side effects
- Event handling
- Supports `ref` as prop, to access DOM elements
- TypeScript support

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/itsjavi/jynxs.git
   cd jynxs
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Start the development server:

   ```
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to see the project in action.

## Usage Example

An example of how to use the JynXS runtime can be found in `src/example.tsx`.

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
