import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';

export default function Login() {
	const navigate = useNavigate();
	const { login, bootstrap } = useAuthStore();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		bootstrap();
	}, [bootstrap]);

	async function onSubmit(e) {
		e.preventDefault();
		setError('');
		const res = await login({ email, password });
		if (res.ok) navigate('/');
		else setError(res.error);
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4">
			<div className="glass-card w-full max-w-md p-6 sm:p-8 animate-fade-in">
				<div className="text-center mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
						Welcome back
					</h1>
					<p className="text-slate-400 mt-2 text-sm sm:text-base">Sign in to your account</p>
				</div>
				
				<form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
					<div className="space-y-3 sm:space-y-4">
						<input
							type="email"
							placeholder="Enter your email"
							className="input-field w-full text-sm sm:text-base"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Enter your password"
							className="input-field w-full text-sm sm:text-base"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					
					{error && (
						<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
							{error}
						</div>
					)}
					
					<button type="submit" className="btn-primary w-full text-sm sm:text-base">
						Sign In
					</button>
				</form>
				
				<div className="mt-4 sm:mt-6 text-center">
					<p className="text-slate-400 text-sm sm:text-base">
						Don't have an account?{' '}
						<Link className="text-purple-400 hover:text-purple-300 font-medium transition-colors" to="/register">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
