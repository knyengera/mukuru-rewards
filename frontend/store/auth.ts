"use client";
import { create } from 'zustand';
import { apiPost } from '@/lib/api';

type User = { id: string; email: string; name: string; tier: string; role?: string } | null;

type AuthState = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  async login(email, password) {
    const res = await apiPost<{ token: string; user: any }>(`/api/auth/login`, { email, password });
    localStorage.setItem('auth_token', res.token);
    set({ token: res.token, user: res.user });
  },
  logout() {
    localStorage.removeItem('auth_token');
    set({ token: null, user: null });
  },
  async register(name, email, password) {
    await apiPost(`/api/auth/register`, { name, email, password });
  },
}));


