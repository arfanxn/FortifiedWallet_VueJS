// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_API_URL: string
  // Add other environment variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
