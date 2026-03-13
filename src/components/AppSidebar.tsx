import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  CalendarRange,
  ClipboardCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Music2,
  BarChart3,
  FolderKanban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Projetos', path: '/projetos', icon: FolderKanban },
  { label: 'Milestones', path: '/milestones', icon: ListChecks },
  { label: 'Roadmap', path: '/roadmap', icon: CalendarRange },
  { label: 'Indicadores', path: '/indicadores', icon: BarChart3 },
  { label: 'Avaliação Trimestral', path: '/avaliacao', icon: ClipboardCheck },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                collapsed && 'justify-center px-0'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
