import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useAuthStore } from './store/auth.js';

function ProtectedRoute() {
	const isAuthed = useAuthStore((s) => !!s.user);
	const location = useLocation();
	if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />;
	return <Outlet />;
}

function AuthRedirectRoute({ children }) {
	const isAuthed = useAuthStore((s) => !!s.user);
	if (isAuthed) return <Navigate to="/" replace />;
	return children;
}

export default function App() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
			<div className="relative mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
				<Routes>
					<Route
						path="/login"
						element={
							<AuthRedirectRoute>
								<Login />
							</AuthRedirectRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<AuthRedirectRoute>
								<Register />
							</AuthRedirectRoute>
						}
					/>
					<Route element={<ProtectedRoute />}>
						<Route index element={<Dashboard />} />
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</div>
		</div>
	);
}
