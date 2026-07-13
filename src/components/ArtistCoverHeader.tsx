import { ReactNode } from 'react';
import { Artist, CAREER_PHASE_LABELS, Project } from '@/types';
import { formatQuarter } from '@/lib/helpers';

export function ArtistCoverHeader({ artist, project, aside }: {
  artist: Artist;
  project: Project;
  aside?: ReactNode;
}) {
  const concept = project.dna?.artisticConcept;

  return (
    <div className="flex items-start justify-between gap-6 pb-6 mb-8 border-b-2 border-foreground">
      <div className="flex-1 min-w-0">
        <span className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          {CAREER_PHASE_LABELS[project.careerPhase]}
        </span>

        <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-tight mb-4">
          {artist.name}
        </h1>

        <div className="relative pl-8 mb-4 max-w-2xl">
          <span
            className="absolute left-0 -top-3 font-display text-5xl text-muted-foreground/40 select-none"
            aria-hidden="true"
          >
            “
          </span>
          <p className="italic font-display text-xl md:text-2xl text-foreground/90 leading-snug">
            {concept || 'Conceito artístico ainda não definido.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground flex-wrap">
          {artist.genre && <span>{artist.genre}</span>}
          {artist.genre && <span>·</span>}
          <span>{formatQuarter(project.currentQuarter, project.currentYear)}</span>
          <span>·</span>
          <span>{project.stage}</span>
        </div>
      </div>

      {aside && <div className="shrink-0 pt-1">{aside}</div>}
    </div>
  );
}
