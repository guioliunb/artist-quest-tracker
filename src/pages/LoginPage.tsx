import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <Music2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-xl text-foreground">Milestone Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de carreira musical</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm rounded-md py-2.5 hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Acesso restrito a consultores e artistas cadastrados.
        </p>
      </div>
    </div>
  );
}
