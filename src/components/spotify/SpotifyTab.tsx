import { useProject } from '@/contexts/ProjectContext';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, formatNumber } from '@/lib/helpers';
import { BadgeCheck, ExternalLink, Headphones, ListMusic, Users } from 'lucide-react';

// Generic placeholder photo for artists without a real profile image connected —
// a bust silhouette over a soft gradient, matching the app's editorial line-art icons
// (see EmptyState illustrations) rather than depending on an external image host.
function GenericArtistImage({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 64 64" className="w-full h-full" role="img" aria-label="Foto genérica do artista">
        <defs>
          <linearGradient id="genericArtistBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="32" fill="url(#genericArtistBg)" />
        <g fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="26" r="10" />
          <path d="M12 54c2-11 10-17 20-17s18 6 20 17" />
        </g>
      </svg>
    </div>
  );
}

function SpotifyStatTile({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center shrink-0 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="font-display font-bold text-xl text-foreground tabular-nums leading-none">{formatNumber(value)}</div>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function SpotifyTab({ artistId, artistName }: { artistId: string; artistName: string }) {
  const { spotifyProfiles } = useProject();
  const profile = spotifyProfiles.find(p => p.artistId === artistId);

  if (!profile) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <EmptyState
          illustration="indicadores"
          title="Perfil do Spotify ainda não conectado"
          description="Conecte o perfil profissional deste artista para acompanhar faixas, ouvintes e playlists direto por aqui."
        />
      </div>
    );
  }

  const sortedTracks = [...profile.topTracks].sort((a, b) => b.streams - a.streams);
  const maxStreams = Math.max(...sortedTracks.map(t => t.streams), 1);

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <section className="bg-card rounded-lg border border-border p-6 flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <GenericArtistImage className="w-16 h-16 rounded-full overflow-hidden border border-border shrink-0" />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-semibold text-lg text-foreground">{artistName}</h2>
              {profile.verified && <BadgeCheck className="w-4 h-4 text-status-completed" />}
            </div>
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-editorial inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver perfil no Spotify <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SpotifyStatTile label="Ouvintes mensais" value={profile.monthlyListeners} icon={Headphones} />
          <SpotifyStatTile label="Seguidores" value={profile.followers} icon={Users} />
        </div>
      </section>

      {/* Top tracks */}
      <section className="bg-card rounded-lg border border-border p-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Faixas mais tocadas
        </h2>
        <div className="space-y-3">
          {sortedTracks.map((track, i) => (
            <div key={track.id} className="relative overflow-hidden rounded-md border border-border">
              <div
                className="absolute inset-y-0 left-0 bg-primary/10"
                style={{ width: `${Math.round((track.streams / maxStreams) * 100)}%` }}
              />
              <div className="relative flex items-center gap-4 px-4 py-3">
                <span className="font-display font-bold text-lg text-muted-foreground w-6 text-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate block">{track.title}</span>
                  {track.releaseDate && (
                    <span className="text-[11px] text-muted-foreground">Lançada em {formatDate(track.releaseDate)}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground tabular-nums shrink-0">{formatNumber(track.streams)} streams</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Playlists */}
      {profile.playlists.length > 0 && (
        <section className="bg-card rounded-lg border border-border p-5">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Presença em playlists
          </h2>
          <div>
            {profile.playlists.map(pl => (
              <div key={pl.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                <ListMusic className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate block">{pl.playlistName}</span>
                  {pl.curator && <span className="text-[11px] text-muted-foreground">{pl.curator}</span>}
                </div>
                {pl.followers != null && (
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">{formatNumber(pl.followers)} seguidores</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
