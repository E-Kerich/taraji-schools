import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  login: async (credentials) => {
    set({ loading: true });
    const { data } = await api.post('/auth/login', credentials);

    localStorage.setItem('token', data.token);
    set({
      user: data.user,
      token: data.token,
      loading: false
    });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user });
    } catch {
      set({ user: null, token: null });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));
