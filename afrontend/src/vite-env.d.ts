console.log('Application started');/// <reference types="vite/client" />
/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_REACT_APP_SERVER_URL: string;
    // add more variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }