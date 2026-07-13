import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { SectionDivider } from '@/components/SectionDivider';
import { useProject } from '@/contexts/ProjectContext';
import { SocialMetricValue } from '@/types';
import { formatQuarter, formatCurrency, formatNumber } from '@/lib/helpers';
import { BarChart3, Music2, Users, DollarSign, TrendingUp, TrendingDown, Minus, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ---------- Ícones de plataforma (marcas simplificadas, não os traços genéricos do lucide) ---------- */

function FacebookBadge({ className }: { className?: string }) {
  return (
    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', className)} style={{ background: '#1877F2' }}>
      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" width="18" height="18">
        <path fill="#fff" d="M13.5 21v-7.2h2.4l.36-2.8h-2.76v-1.8c0-.81.22-1.36 1.39-1.36h1.48V5.32c-.26-.03-1.13-.11-2.14-.11-2.12 0-3.57 1.29-3.57 3.67v2.05H8.25v2.8h2.41V21h2.84Z"/>
      </svg>
    </div>
  );
}

function InstagramBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', className)}
      style={{ background: 'linear-gradient(135deg, #FEDA75 0%, #FA7E1E 22%, #D62976 55%, #962FBF 78%, #4F5BD5 100%)' }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="1.8">
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.2" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="16.3" cy="7.7" r="0.9" fill="#fff" stroke="none" />
      </svg>
    </div>
  );
}

function TiktokBadge({ className }: { className?: string }) {
  return (
    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', className)} style={{ background: '#000' }}>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <g transform="translate(-0.6,0)">
          <path fill="#25F4EE" d="M15.4 6.1c-.9-.6-1.5-1.6-1.6-2.7h-1V15c0 1.1-.9 2-2 2-.5 0-1-.2-1.3-.5-.6-.5-1-1.3-1-2.1 0-1.6 1.3-2.9 2.9-2.9.2 0 .4 0 .6.1V8.9c-.2 0-.4 0-.6 0-2.7 0-4.9 2.2-4.9 4.9 0 1.6.8 3 1.9 3.9.8.7 1.9 1.1 3 1.1 2.7 0 4.9-2.2 4.9-4.9V8.6c.9.6 1.9 1 3 1.1V7.7c-.6 0-1.3-.2-1.9-.6" opacity="0.75" transform="translate(0.35,0)"/>
          <path fill="#FE2C55" d="M15.4 6.1c-.9-.6-1.5-1.6-1.6-2.7h-1V15c0 1.1-.9 2-2 2-.5 0-1-.2-1.3-.5-.6-.5-1-1.3-1-2.1 0-1.6 1.3-2.9 2.9-2.9.2 0 .4 0 .6.1V8.9c-.2 0-.4 0-.6 0-2.7 0-4.9 2.2-4.9 4.9 0 1.6.8 3 1.9 3.9.8.7 1.9 1.1 3 1.1 2.7 0 4.9-2.2 4.9-4.9V8.6c.9.6 1.9 1 3 1.1V7.7c-.6 0-1.3-.2-1.9-.6" opacity="0.75" transform="translate(-0.35,0)"/>
          <path fill="#fff" d="M15.4 6.1c-.9-.6-1.5-1.6-1.6-2.7h-1V15c0 1.1-.9 2-2 2-.5 0-1-.2-1.3-.5-.6-.5-1-1.3-1-2.1 0-1.6 1.3-2.9 2.9-2.9.2 0 .4 0 .6.1V8.9c-.2 0-.4 0-.6 0-2.7 0-4.9 2.2-4.9 4.9 0 1.6.8 3 1.9 3.9.8.7 1.9 1.1 3 1.1 2.7 0 4.9-2.2 4.9-4.9V8.6c.9.6 1.9 1 3 1.1V7.7c-.6 0-1.3-.2-1.9-.6"/>
        </g>
      </svg>
    </div>
  );
}

function YoutubeBadge({ className }: { className?: string }) {
  return (
    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', className)} style={{ background: '#FF0000' }}>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#fff" d="M9.8 15.5V8.5l6.2 3.5-6.2 3.5Z"/>
      </svg>
    </div>
  );
}

/* ---------- Valor editável — qualquer captura automática pode ser sobrescrita à mão ---------- */

function EditableValue({ value, formatted, overridden, onSave, onReset }: {
  value: number;
  formatted: string;
  overridden: boolean;
  onSave: (v: number) => void;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    const n = Number(draft);
    if (!Number.isNaN(n)) onSave(n);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        type="number"
        step="any"
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        className="w-20 bg-background border border-primary/50 rounded px-1.5 py-0.5 text-sm text-foreground text-right tabular-nums focus:outline-none"
      />
    );
  }

  return (
    <span className="group/edit inline-flex items-center gap-1">
      <button
        onClick={() => { setDraft(String(value)); setEditing(true); }}
        title="Clique para editar"
        className={cn(
          'text-sm font-medium tabular-nums underline decoration-dashed decoration-transparent hover:decoration-current underline-offset-2 transition-colors',
          overridden ? 'text-primary' : 'text-foreground',
        )}
      >
        {formatted}
      </button>
      {overridden && (
        <button
          onClick={onReset}
          title="Restaurar valor capturado automaticamente"
          className="opacity-0 group-hover/edit:opacity-100 text-muted-foreground hover:text-status-delayed transition-opacity"
        >
          <RotateCcw className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
}

function MetricCard({ label, value, previousValue, format = 'number', overrideKey }: {
  label: string;
  value: number;
  previousValue?: number;
  format?: 'number' | 'currency';
  overrideKey: string;
}) {
  const { activeProject, overrides, setOverride, clearOverride } = useProject();
  const fullKey = `${activeProject.id}::demand::${overrideKey}`;
  const overridden = fullKey in overrides;
  const displayValue = overridden ? Number(overrides[fullKey]) : value;
  const formatted = format === 'currency' ? formatCurrency(displayValue) : formatNumber(displayValue);

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (previousValue !== undefined) {
    if (displayValue > previousValue) trend = 'up';
    else if (displayValue < previousValue) trend = 'down';
  }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <EditableValue
          value={displayValue}
          formatted={formatted}
          overridden={overridden}
          onSave={v => setOverride(fullKey, v)}
          onReset={() => clearOverride(fullKey)}
        />
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-status-completed" />}
        {trend === 'down' && <TrendingDown className="w-3 h-3 text-status-delayed" />}
        {trend === 'neutral' && previousValue !== undefined && <Minus className="w-3 h-3 text-muted-foreground" />}
      </div>
    </div>
  );
}

function SocialMetricCard({ label, metric, format = 'number', overrideKey }: {
  label: string;
  metric?: SocialMetricValue;
  format?: 'number' | 'percentage';
  overrideKey: string;
}) {
  const { activeProject, overrides, setOverride, clearOverride } = useProject();
  if (!metric) return null;
  const fullKey = `${activeProject.id}::social::${overrideKey}`;
  const overridden = fullKey in overrides;
  const displayValue = overridden ? Number(overrides[fullKey]) : metric.values;
  const formatted = format === 'percentage' ? `${displayValue.toFixed(1)}%` : formatNumber(Math.round(displayValue));
  const diff = metric.comparison?.difference;

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <EditableValue
          value={displayValue}
          formatted={formatted}
          overridden={overridden}
          onSave={v => setOverride(fullKey, v)}
          onReset={() => clearOverride(fullKey)}
        />
        {!overridden && diff != null && diff > 0 && <TrendingUp className="w-3 h-3 text-status-completed" />}
        {!overridden && diff != null && diff < 0 && <TrendingDown className="w-3 h-3 text-status-delayed" />}
      </div>
    </div>
  );
}

function MetricSection({ title, icon, children }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2.5 mb-4">
        {icon}
        <h2 className="font-display font-semibold text-sm text-foreground">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

function RealDemandComparison() {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h2 className="font-display font-semibold text-sm text-foreground mb-3">
        Demanda Real vs. Métricas de Alcance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Métricas de Alcance</span>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• Visualizações</li>
            <li>• Alcance</li>
            <li>• Likes</li>
            <li>• Seguidores em redes sociais</li>
          </ul>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-status-completed">Demanda Real</span>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• Ingressos vendidos</li>
            <li>• Shows solicitados</li>
            <li>• Músicas salvas / Playlist adds</li>
            <li>• Superfãs ativos</li>
            <li>• Royalties e licenciamento</li>
          </ul>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-4 pt-3 border-t border-border">
        As métricas de mídias sociais acima (curtidas, comentários, alcance e visualizações) entram como contexto
        complementar de alcance — não substituem a distinção abaixo.
      </p>
    </div>
  );
}

export default function IndicadoresPage() {
  const { activeProject, demandMetrics, socialSnapshot: social } = useProject();
  const latest = demandMetrics[demandMetrics.length - 1];
  const previous = demandMetrics.length > 1 ? demandMetrics[demandMetrics.length - 2] : undefined;

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8 pb-4 border-b-2 border-foreground">
          <h1 className="font-display font-bold text-2xl text-foreground">Indicadores</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatQuarter(activeProject.currentQuarter, activeProject.currentYear)} — Demanda, Retenção e Monetização.
            Clique em qualquer valor para sobrescrever manualmente.
          </p>
        </div>

        {/* Social Media */}
        <section className="mb-8">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Mídias Sociais <span className="normal-case text-[11px]">({social.period.start} a {social.period.end})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricSection title="Facebook" icon={<FacebookBadge />}>
              <SocialMetricCard label="Alcance da página" metric={social.facebook.pageReach} overrideKey="facebook.pageReach" />
              <SocialMetricCard label="Engajamento em posts" metric={social.facebook.postEngagements} overrideKey="facebook.postEngagements" />
              <SocialMetricCard label="Taxa de engajamento" metric={social.facebook.postEngagementRate} format="percentage" overrideKey="facebook.postEngagementRate" />
              <SocialMetricCard label="Visualizações de vídeo" metric={social.facebook.videoViews} overrideKey="facebook.videoViews" />
            </MetricSection>

            <MetricSection title="Instagram" icon={<InstagramBadge />}>
              <SocialMetricCard label="Visitas ao perfil" metric={social.instagram.profileViews} overrideKey="instagram.profileViews" />
              <SocialMetricCard label="Visualizações totais" metric={social.instagram.views} overrideKey="instagram.views" />
              <SocialMetricCard label="Visualizações de stories" metric={social.instagram.storiesViews} overrideKey="instagram.storiesViews" />
            </MetricSection>

            <MetricSection title="TikTok" icon={<TiktokBadge />}>
              <SocialMetricCard label="Visualizações" metric={social.tiktok.views} overrideKey="tiktok.views" />
              <SocialMetricCard label="Curtidas" metric={social.tiktok.likes} overrideKey="tiktok.likes" />
              <SocialMetricCard label="Comentários" metric={social.tiktok.comments} overrideKey="tiktok.comments" />
              <SocialMetricCard label="Compartilhamentos" metric={social.tiktok.shares} overrideKey="tiktok.shares" />
              <SocialMetricCard label="Seguidores" metric={social.tiktok.follows} overrideKey="tiktok.follows" />
            </MetricSection>

            <MetricSection title="YouTube" icon={<YoutubeBadge />}>
              <SocialMetricCard label="Visualizações" metric={social.youtube.views} overrideKey="youtube.views" />
              <SocialMetricCard label="Curtidas" metric={social.youtube.likes} overrideKey="youtube.likes" />
              <SocialMetricCard label="Comentários" metric={social.youtube.comments} overrideKey="youtube.comments" />
              <SocialMetricCard label="Compartilhamentos" metric={social.youtube.shares} overrideKey="youtube.shares" />
              <SocialMetricCard label="Variação de inscritos" metric={social.youtube.subscribersVariation} overrideKey="youtube.subscribersVariation" />
            </MetricSection>
          </div>
        </section>

        {/* Vanity vs Real */}
        <section className="mb-8">
          <RealDemandComparison />
        </section>

        <SectionDivider className="mb-8" />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <MetricSection title="Shows" icon={<BarChart3 className="w-4 h-4 text-status-in-progress" />}>
            <MetricCard label="Shows solicitados" value={latest.shows.requested} previousValue={previous?.shows.requested} overrideKey="shows.requested" />
            <MetricCard label="Shows fechados" value={latest.shows.confirmed} previousValue={previous?.shows.confirmed} overrideKey="shows.confirmed" />
            <MetricCard label="Ingressos vendidos" value={latest.shows.ticketsSold} previousValue={previous?.shows.ticketsSold} overrideKey="shows.ticketsSold" />
            <MetricCard label="VIPs / Convidados" value={latest.shows.vipGuests} previousValue={previous?.shows.vipGuests} overrideKey="shows.vipGuests" />
          </MetricSection>

          <MetricSection title="Streaming" icon={<Music2 className="w-4 h-4 text-status-completed" />}>
            <MetricCard label="Ouvintes mensais" value={latest.streaming.monthlyListeners} previousValue={previous?.streaming.monthlyListeners} overrideKey="streaming.monthlyListeners" />
            <MetricCard label="Seguidores" value={latest.streaming.followers} previousValue={previous?.streaming.followers} overrideKey="streaming.followers" />
            <MetricCard label="Salvamentos" value={latest.streaming.saves} previousValue={previous?.streaming.saves} overrideKey="streaming.saves" />
            <MetricCard label="Playlist adds" value={latest.streaming.playlistAdds} previousValue={previous?.streaming.playlistAdds} overrideKey="streaming.playlistAdds" />
            <MetricCard label="Pré-saves" value={latest.streaming.preSaves} previousValue={previous?.streaming.preSaves} overrideKey="streaming.preSaves" />
          </MetricSection>

          <MetricSection title="Comunidade" icon={<Users className="w-4 h-4 text-status-delayed" />}>
            <MetricCard label="Superfãs ativos" value={latest.community.superFansActive} previousValue={previous?.community.superFansActive} overrideKey="community.superFansActive" />
            <MetricCard label="Grupo fechado" value={latest.community.closedGroup} previousValue={previous?.community.closedGroup} overrideKey="community.closedGroup" />
            <MetricCard label="Compartilhamentos" value={latest.community.shares} previousValue={previous?.community.shares} overrideKey="community.shares" />
            <MetricCard label="Participação em campanhas" value={latest.community.campaignParticipation} previousValue={previous?.community.campaignParticipation} overrideKey="community.campaignParticipation" />
          </MetricSection>

          <MetricSection title="Monetização" icon={<DollarSign className="w-4 h-4 text-primary" />}>
            <MetricCard label="Royalties de streaming" value={latest.monetization.streamingRoyalties} previousValue={previous?.monetization.streamingRoyalties} format="currency" overrideKey="monetization.streamingRoyalties" />
            <MetricCard label="Execução pública" value={latest.monetization.publicPerformance} previousValue={previous?.monetization.publicPerformance} format="currency" overrideKey="monetization.publicPerformance" />
            <MetricCard label="Publishing" value={latest.monetization.publishing} previousValue={previous?.monetization.publishing} format="currency" overrideKey="monetization.publishing" />
            <MetricCard label="Sincronização" value={latest.monetization.sync} previousValue={previous?.monetization.sync} format="currency" overrideKey="monetization.sync" />
            <MetricCard label="Marcas" value={latest.monetization.brands} previousValue={previous?.monetization.brands} format="currency" overrideKey="monetization.brands" />
            <MetricCard label="Licenciamento" value={latest.monetization.licensing} previousValue={previous?.monetization.licensing} format="currency" overrideKey="monetization.licensing" />
          </MetricSection>
        </div>
      </div>
    </AppLayout>
  );
}
