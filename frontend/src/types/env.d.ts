// src/types/env.d.ts
/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_SUPABASE_URL: string;
    readonly REACT_APP_SUPABASE_ANON_KEY: string;
  }
}