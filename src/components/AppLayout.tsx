import { AppSidebar } from './AppSidebar';
import { ActiveProjectContextBar } from './ActiveProjectContextBar';
import { useProject } from '@/contexts/ProjectContext';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isDemo } = useProject();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto scrollbar-thin">
        {isDemo && (
          <div className="sticky top-0 z-20 bg-primary text-primary-foreground text-center text-xs font-medium uppercase tracking-wider py-1.5 px-4">
            Modo demonstração — dados fictícios
          </div>
        )}
        <ActiveProjectContextBar />
        {children}
      </main>
    </div>
  );
}
