/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API (no trailing slash), e.g.  */
  readonly VITE_API_URL?: string;
  /** Base URL for images/files served by the backend, e.g.  */
  readonly VITE_RES_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
