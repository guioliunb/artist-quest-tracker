import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Music2,
  BarChart3,
  FolderKanban,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useBasePath } from '@/contexts/ProjectContext';

const navItems = [
  { label: 'Projetos', path: '/projetos', icon: FolderKanban },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Milestones', path: '/milestones', icon: ListChecks },
  { label: 'Indicadores', path: '/indicadores', icon: BarChart3 },
  { label: 'Agenda', path: '/agenda', icon: CalendarRange },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const basePath = useBasePath();

  return (
    <aside
      className={cn(
        'flex flex-col h-screen border-r border-border bg-sidebar transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-border', collapsed && 'justify-center px-0')}>
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Music2 className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-sm tracking-tight text-foreground truncate">
            Milestone Tracker
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const fullPath = `${basePath}${item.path}`;
          const isActive = location.pathname === fullPath;
          return (
            <Link
              key={item.path}
              to={fullPath}
              className={cn(
                'flex items-center gap-3 pl-2.5 pr-3 py-2.5 rounded-r-md border-l-[3px] text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50',
                collapsed && 'justify-center px-0 border-l-0'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle + collapse toggle */}
      <div className="flex items-stretch border-t border-border">
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="flex-1 flex items-center justify-center h-12 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Alternar tema claro/escuro"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-1 flex items-center justify-center h-12 border-l border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
