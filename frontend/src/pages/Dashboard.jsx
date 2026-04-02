import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.js';
import { api } from '../api/client.js';

export default function Dashboard() {
	const { user, logout, bootstrap } = useAuthStore();
	const [todos, setTodos] = useState([]);
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		(async () => {
			await bootstrap();
			await loadTodos();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadTodos() {
		setLoading(true);
		try {
			const { data } = await api.get('/todos');
			setTodos(data.todos);
		} catch (e) {
			setError(e.response?.data?.error || 'Failed to load todos');
		} finally {
			setLoading(false);
		}
	}

	async function createTodo(e) {
		e.preventDefault();
		if (!title.trim()) return;
		const { data } = await api.post('/todos', { title: title.trim() });
		setTodos((t) => [data.todo, ...t]);
		setTitle('');
	}

	async function toggleTodo(id, completed) {
		const { data } = await api.put(`/todos/${id}`, { completed });
		setTodos((t) => t.map((x) => (x._id === id ? data.todo : x)));
	}

	async function updateTitle(id, newTitle) {
		const { data } = await api.put(`/todos/${id}`, { title: newTitle });
		setTodos((t) => t.map((x) => (x._id === id ? data.todo : x)));
	}

	async function removeTodo(id) {
		await api.delete(`/todos/${id}`);
		setTodos((t) => t.filter((x) => x._id !== id));
	}

	return (
		<div className="animate-fade-in">
			<header className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
						Your Tasks
					</h1>
					<p className="text-slate-400 mt-1 text-sm sm:text-base">Organize your life, one task at a time</p>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
					<span className="text-xs sm:text-sm text-slate-400 break-all sm:break-normal">{user?.email}</span>
					<button onClick={logout} className="btn-secondary text-sm sm:text-base">
						Log out
					</button>
				</div>
			</header>

			<form onSubmit={createTodo} className="glass-card mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 p-4 sm:p-6">
				<input
					type="text"
					placeholder="What needs to be done?"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="input-field flex-1 text-sm sm:text-base"
				/>
				<button className="btn-primary whitespace-nowrap text-sm sm:text-base">Add Task</button>
			</form>

			{loading ? (
				<div className="glass-card p-6 sm:p-8 text-center">
					<div className="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
					<p className="text-slate-400 mt-4 text-sm sm:text-base">Loading your tasks...</p>
				</div>
			) : error ? (
				<div className="glass-card p-4 sm:p-6">
					<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base">
						{error}
					</div>
				</div>
			) : todos.length === 0 ? (
				<div className="glass-card p-8 sm:p-12 text-center">
					<div className="text-4xl sm:text-6xl mb-4">📝</div>
					<h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2">No tasks yet</h3>
					<p className="text-slate-400 text-sm sm:text-base">Add your first task above to get started!</p>
				</div>
			) : (
				<div className="space-y-3 sm:space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
						<h2 className="text-lg sm:text-xl font-semibold text-slate-200">
							{todos.length} {todos.length === 1 ? 'task' : 'tasks'}
						</h2>
						<div className="text-xs sm:text-sm text-slate-400">
							{todos.filter(t => t.completed).length} completed
						</div>
					</div>
					<ul className="space-y-2 sm:space-y-3">
						{todos.map((t) => (
							<li key={t._id} className="todo-item animate-slide-up">
								<div className="flex items-center gap-2 sm:gap-4">
									<input
										type="checkbox"
										checked={t.completed}
										onChange={(e) => toggleTodo(t._id, e.target.checked)}
										className="h-4 w-4 sm:h-5 sm:w-5 accent-purple-500 rounded border-2 border-slate-600 bg-slate-800 flex-shrink-0"
									/>
									<EditableTitle title={t.title} onSave={(val) => updateTitle(t._id, val)} />
									<button
										onClick={() => removeTodo(t._id)}
										className="ml-auto rounded-lg bg-red-500/10 px-2 sm:px-3 py-1 sm:py-2 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs sm:text-sm flex-shrink-0"
									>
										Delete
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

function EditableTitle({ title, onSave }) {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(title);
	useEffect(() => setValue(title), [title]);
	return editing ? (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSave(value.trim() || title);
				setEditing(false);
			}}
			className="flex-1"
		>
			<input
				className="input-field w-full text-base"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				autoFocus
			/>
		</form>
	) : (
		<button 
			onClick={() => setEditing(true)} 
			className="flex-1 text-left text-slate-100 hover:text-purple-300 transition-colors min-w-0"
		>
			<span className={`text-sm sm:text-base lg:text-lg break-words ${title.startsWith('✓') ? 'line-through opacity-60' : ''}`}>
				{title}
			</span>
		</button>
	);
}
