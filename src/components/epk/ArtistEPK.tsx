import { forwardRef } from 'react';
import { ArtistCoverHeader } from '@/components/ArtistCoverHeader';
import { Artist, DemandMetrics, Project, SocialMetricsSnapshot } from '@/types';
import { formatNumber } from '@/lib/helpers';

function EPKMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center px-2">
      <div className="font-display font-bold text-3xl text-foreground tabular-nums leading-none">
        {formatNumber(value)}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

export interface ArtistEPKProps {
  artist: Artist;
  project: Project;
  demandMetrics: DemandMetrics[];
  socialSnapshot: SocialMetricsSnapshot;
  managerName: string;
  generatedAt: Date;
}

export const ArtistEPK = forwardRef<HTMLDivElement, ArtistEPKProps>(function ArtistEPK(
  { artist, project, demandMetrics, socialSnapshot, managerName, generatedAt },
  ref,
) {
  const latest = demandMetrics[demandMetrics.length - 1];
  const reach = Math.round(
    socialSnapshot.instagram.views?.values ?? socialSnapshot.facebook.pageReach?.values ?? 0,
  );
  const pos = project.positioning;
  const aud = project.audience;

  return (
    <div ref={ref} className="epk-print-surface bg-background text-foreground p-10 w-[794px]">
      <ArtistCoverHeader artist={artist} project={project} />

      {pos && (
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Posicionamento</span>
          <p className="font-display text-xl text-foreground mt-1 mb-2 leading-snug">{pos.valueProposition}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider flex-wrap">
            <span>{pos.mainGenre}</span>
            <span>·</span>
            <span>{pos.subGenre}</span>
            <span>·</span>
            <span>{pos.culturalTerritory}</span>
          </div>
        </div>
      )}

      {aud && (
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Público</span>
          <p className="text-sm text-foreground mt-1 mb-2">{aud.ageRange} · {aud.culturalScene}</p>
          <div className="flex flex-wrap gap-1.5">
            {aud.mainPlatforms.map(p => (
              <span key={p} className="text-xs bg-accent px-2 py-0.5 rounded text-foreground">{p}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 py-6 border-y-2 border-foreground mb-8">
        <EPKMetric label="Ouvintes mensais" value={latest?.streaming.monthlyListeners ?? 0} />
        <EPKMetric label="Alcance" value={reach} />
        <EPKMetric label="Superfãs ativos" value={latest?.community.superFansActive ?? 0} />
        <EPKMetric label="Shows confirmados" value={latest?.shows.confirmed ?? 0} />
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider pt-2">
        <span>{managerName}</span>
        <span>Gerado em {generatedAt.toLocaleDateString('pt-BR')}</span>
      </div>
    </div>
  );
});
