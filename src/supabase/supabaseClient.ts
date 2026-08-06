import { createBrowserClient } from '@supabase/ssr';

export const AVATAR_CACHE_KEY = 'meshroc_avatar_cache';
export const AVATAR_CACHE_EXPIRE = 24 * 60 * 60 * 1000;

// 与 my-forum 共用同一套 Supabase 实例与数据表，实现账号互通、群聊互通
export const SUPABASE_URL = "https://xwhwcmorcmgpfpocmgez.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aHdjbW9yY21ncGZwb2NtZ2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODk2MzQsImV4cCI6MjA5NjI2NTYzNH0.O5YcPuehUMjEofFdoNfE5NDxT71qtcMdYeLCvyyoQgw";

const isBrowser = typeof window !== 'undefined';

const ssrEmptyClient = {
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    signInWithOAuth: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null } }),
    getUser: async () => ({ data: { user: null } }),
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) })
  })
};

export const supabase = isBrowser
  ? createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flow: 'pkce',
      cookieOptions: {
        secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      },
    },
  })
  : ssrEmptyClient;
