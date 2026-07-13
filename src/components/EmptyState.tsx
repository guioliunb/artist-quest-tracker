type Illustration = 'milestones' | 'agenda' | 'indicadores' | 'projetos';

function MilestonesIllustration() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="10" width="36" height="46" rx="4" />
      <rect x="24" y="6" width="16" height="8" rx="2" />
      <line x1="22" y1="26" x2="42" y2="26" />
      <line x1="22" y1="34" x2="42" y2="34" />
      <path d="M21 43l3 3 6-7" />
    </svg>
  );
}

function AgendaIllustration() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="14" width="44" height="38" rx="4" />
      <line x1="20" y1="8" x2="20" y2="18" />
      <line x1="44" y1="8" x2="44" y2="18" />
      <line x1="10" y1="24" x2="54" y2="24" />
      <rect x="26" y="32" width="12" height="12" rx="1" />
    </svg>
  );
}

function IndicadoresIllustration() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12v38h40" />
      <path d="M16 42l8-10 8 6 10-14" />
      <circle cx="46" cy="20" r="6" />
      <line x1="50.5" y1="24.5" x2="56" y2="30" />
    </svg>
  );
}

function ProjetosIllustration() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 18a4 4 0 0 1 4-4h10l4 5h22a4 4 0 0 1 4 4v25a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4Z" />
      <line x1="32" y1="29" x2="32" y2="41" />
      <line x1="26" y1="35" x2="38" y2="35" />
    </svg>
  );
}

const ILLUSTRATIONS: Record<Illustration, () => JSX.Element> = {
  milestones: MilestonesIllustration,
  agenda: AgendaIllustration,
  indicadores: IndicadoresIllustration,
  projetos: ProjetosIllustration,
};

export function EmptyState({ illustration, title, description, action }: {
  illustration: Illustration;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  const Illustration = ILLUSTRATIONS[illustration];

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground mb-4">
        <Illustration />
      </div>
      <h3 className="font-display font-semibold text-base text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
