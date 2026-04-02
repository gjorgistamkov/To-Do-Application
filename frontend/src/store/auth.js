import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4000/api', withCredentials: true });

export const useAuthStore = create((set, get) => ({
	user: null,
	loading: false,
	async bootstrap() {
		try {
			const { data } = await api.get('/auth/me');
			set({ user: data.user || null });
		} catch (_e) {
			set({ user: null });
		}
	},
	async login(payload) {
		set({ loading: true });
		try {
			const { data } = await api.post('/auth/login', payload);
			set({ user: data.user, loading: false });
			return { ok: true };
		} catch (e) {
			set({ loading: false });
			return { ok: false, error: e.response?.data?.error || 'Login failed' };
		}
	},
	async register(payload) {
		set({ loading: true });
		try {
			const { data } = await api.post('/auth/register', payload);
			set({ user: data.user, loading: false });
			return { ok: true };
		} catch (e) {
			set({ loading: false });
			return { ok: false, error: e.response?.data?.error || 'Register failed' };
		}
	},
	async logout() {
		await api.post('/auth/logout');
		set({ user: null });
	},
}));
