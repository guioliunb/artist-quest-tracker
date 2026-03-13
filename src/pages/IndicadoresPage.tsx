import { AppLayout } from '@/components/AppLayout';
import { mockProject, mockArtist, mockDemandMetrics } from '@/data/mockData';
import { formatQuarter, formatCurrency, formatNumber } from '@/lib/helpers';
import { BarChart3, Music2, Users, DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

function MetricCard({ label, value, previousValue, format = 'number' }: {
  label: string;
  value: number;
  previousValue?: number;
  format?: 'number' | 'currency';
}) {
  const formatted = format === 'currency' ? formatCurrency(value) : formatNumber(value);
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (previousValue !== undefined) {
    if (value > previousValue) trend = 'up';
    else if (value < previousValue) trend = 'down';
  }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground tabular-nums">{formatted}</span>
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-status-completed" />}
        {trend === 'down' && <TrendingDown className="w-3 h-3 text-status-delayed" />}
        {trend === 'neutral' && previousValue !== undefined && <Minus className="w-3 h-3 text-muted-foreground" />}
      </div>
    </div>
  );
}

function MetricSection({ title, icon: Icon, iconColor, children }: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn('w-4 h-4', iconColor)} />
        <h2 className="font-display font-semibold text-sm text-foreground">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

function VanityAlert() {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h2 className="font-display font-semibold text-sm text-foreground mb-3">
        Demanda Real vs Métricas de Vaidade
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-status-delayed">Métricas de Vaidade</span>
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
    </div>
  );
}

export default function IndicadoresPage() {
  const latest = mockDemandMetrics[mockDemandMetrics.length - 1];
  const previous = mockDemandMetrics.length > 1 ? mockDemandMetrics[mockDemandMetrics.length - 2] : undefined;

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground">Indicadores</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatQuarter(mockProject.currentQuarter, mockProject.currentYear)} — Demanda, Retenção e Monetização
          </p>
        </div>

        {/* Vanity vs Real */}
        <section className="mb-8">
          <VanityAlert />
        </section>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <MetricSection title="Shows" icon={BarChart3} iconColor="text-status-in-progress">
            <MetricCard label="Shows solicitados" value={latest.shows.requested} previousValue={previous?.shows.requested} />
            <MetricCard label="Shows fechados" value={latest.shows.confirmed} previousValue={previous?.shows.confirmed} />
            <MetricCard label="Ingressos vendidos" value={latest.shows.ticketsSold} previousValue={previous?.shows.ticketsSold} />
            <MetricCard label="VIPs / Convidados" value={latest.shows.vipGuests} previousValue={previous?.shows.vipGuests} />
          </MetricSection>

          <MetricSection title="Streaming" icon={Music2} iconColor="text-status-completed">
            <MetricCard label="Ouvintes mensais" value={latest.streaming.monthlyListeners} previousValue={previous?.streaming.monthlyListeners} />
            <MetricCard label="Seguidores" value={latest.streaming.followers} previousValue={previous?.streaming.followers} />
            <MetricCard label="Salvamentos" value={latest.streaming.saves} previousValue={previous?.streaming.saves} />
            <MetricCard label="Playlist adds" value={latest.streaming.playlistAdds} previousValue={previous?.streaming.playlistAdds} />
            <MetricCard label="Pré-saves" value={latest.streaming.preSaves} previousValue={previous?.streaming.preSaves} />
          </MetricSection>

          <MetricSection title="Comunidade" icon={Users} iconColor="text-status-delayed">
            <MetricCard label="Superfãs ativos" value={latest.community.superFansActive} previousValue={previous?.community.superFansActive} />
            <MetricCard label="Grupo fechado" value={latest.community.closedGroup} previousValue={previous?.community.closedGroup} />
            <MetricCard label="Compartilhamentos" value={latest.community.shares} previousValue={previous?.community.shares} />
            <MetricCard label="Participação em campanhas" value={latest.community.campaignParticipation} previousValue={previous?.community.campaignParticipation} />
          </MetricSection>

          <MetricSection title="Monetização" icon={DollarSign} iconColor="text-primary">
            <MetricCard label="Royalties de streaming" value={latest.monetization.streamingRoyalties} previousValue={previous?.monetization.streamingRoyalties} format="currency" />
            <MetricCard label="Execução pública" value={latest.monetization.publicPerformance} previousValue={previous?.monetization.publicPerformance} format="currency" />
            <MetricCard label="Publishing" value={latest.monetization.publishing} previousValue={previous?.monetization.publishing} format="currency" />
            <MetricCard label="Sincronização" value={latest.monetization.sync} previousValue={previous?.monetization.sync} format="currency" />
            <MetricCard label="Marcas" value={latest.monetization.brands} previousValue={previous?.monetization.brands} format="currency" />
            <MetricCard label="Licenciamento" value={latest.monetization.licensing} previousValue={previous?.monetization.licensing} format="currency" />
          </MetricSection>
        </div>
      </div>
    </AppLayout>
  );
}
