# vite-plugin-dumi

[![NPM version](https://img.shields.io/npm/v/vite-plugin-dumi.svg)](https://npmjs.org/package/vite-plugin-dumi)

## How to use this template?

### Github Template

[Click use this template](https://github.com/Dunqing/vite-plugin-starter/generate)

### Clone to local

```bash
npx degit Dunqing/vite-plugin-starter vite-plugin-name

cd vite-plugin-name

pnpm i
```

Then, replace all vite-plugin-dumi with your package name




## Install

```bash
pnpm add vite-plugin-dumi -D
```

## Usage

```typescript
import { defineConfig } from 'vite'
import plugin from 'vite-plugin-dumi'

export default defineConfig({
  plugins: [plugin()],
})
```


### Options

#### `include`

Type: `string` | `Array<string>`<br>
Default: `[]`

Files to include in this plugin (default all).

#### `exclude`

Type: `string` | `Array<string>`<br>
Default: `[]`

Files to exclude in this plugin (default none).

[LICENSE (MIT)](/LICENSE)
