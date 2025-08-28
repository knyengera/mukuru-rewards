"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiPost } from '@/lib/api';

type User = { id: string; email: string; name: string; tier: string; role?: string } | null;

type AuthState = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      async login(email, password) {
        const res = await apiPost<{ token: string; user: any }>(`/api/auth/login`, { email, password });
        localStorage.setItem('auth_token', res.token);
        // Mirror into a cookie so middleware can read it (demo-only; not secure for production)
        try {
          document.cookie = `auth_token=${res.token}; path=/; max-age=604800; samesite=lax`;
        } catch {}
        set({ token: res.token, user: res.user });
      },
      logout() {
        localStorage.removeItem('auth_token');
        try {
          document.cookie = 'auth_token=; path=/; max-age=0; samesite=lax';
        } catch {}
        set({ token: null, user: null });
      },
      async register(name, email, password) {
        await apiPost(`/api/auth/register`, { name, email, password });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);


