/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL pública do site, sem barra final. Usada em canonical, og:url e JSON-LD. */
  readonly VITE_SITE_URL: string
  /** Base da API consumida pelo axios. */
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_FIREBASE_VAPID_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
