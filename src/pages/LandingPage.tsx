import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-rulio-salinas.jpeg";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <img
        src={logo}
        alt="Rulio Salinas"
        className="mb-10 w-72 md:w-96 object-contain"
      />

      <h1 className="mb-4 font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight max-w-3xl">
        Direção estratégica de carreiras musicais.
      </h1>

      <p className="mb-12 max-w-xl text-base md:text-lg text-white/60 leading-relaxed">
        Transforme talento em demanda real. O Milestone Tracker organiza cada etapa da sua carreira — do conceito artístico à monetização — com clareza, método e visão de longo prazo.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-md bg-primary px-10 py-4 text-lg font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
        >
          Entrar
        </button>
        <button
          onClick={() => navigate("/demo")}
          className="rounded-md border border-white/30 px-10 py-4 text-lg font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:scale-105"
        >
          Ver demonstração
        </button>
      </div>

      <span className="mt-8 text-xs text-white/30 tracking-wide uppercase">
        Milestone Tracker — Método proprietário de desenvolvimento artístico
      </span>
    </div>
  );
}
