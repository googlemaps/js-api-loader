# Bundler Integration Tests

This directory contains integration tests to verify that
`@googlemaps/js-api-loader` works correctly with popular JavaScript bundlers
without requiring any configuration from consumers.

The @googlemaps/js-api-loader library has a development-mode (based on
`process.env.NODE_ENV` checks) that toggle detailed warning messages during
development.

The tests in this directory ensure that some of the most popular bundlers
correctly handle the development mode in a default configuration.

1. **Vite** - Correctly replaces `process.env.NODE_ENV` via its built-in
   `define` config
2. **Webpack** - Correctly replaces it via DefinePlugin (default behavior)
3. **Rollup** - Works with standard `@rollup/plugin-replace` configuration

The tests verify both modes:

- **Production mode**: `process.env.NODE_ENV` is replaced, dev warnings are
  removed
- **Development mode**: `process.env.NODE_ENV` is replaced with `"development"`,
  dev warnings are preserved

## Running Tests

```bash
./test-all.sh
```

### Individual bundler:

```bash
cd vite-test
npm install
npm install $(npm pack --silent ../../)
npm run build
```

## What Each Test Does

### Vite (`vite-test/`)

- Uses Vite's zero-config setup
- Relies on Vite's automatic `process.env.NODE_ENV` replacement
- development mode is approximated by disabling minification and building with
  `NODE_ENV='development' vite build --mode development`

### Webpack (`webpack-test/`)

- Uses Webpack 5 with minimal config
- Relies on DefinePlugin (enabled by default in production mode)

### Rollup (`rollup-test/`)

- Uses standard Rollup with `@rollup/plugin-replace`
- Represents how users typically configure Rollup

## Expected Output

All tests should pass with:

```
✓ All bundler tests passed!
```

If any test fails, it means the library is shipping code that won't work
correctly in that bundler without additional user configuration.
