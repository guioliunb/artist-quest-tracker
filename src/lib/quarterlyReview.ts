import { DemandMetrics, Milestone, PillarReview, PillarType, Project, SocialMetricsSnapshot } from '@/types';

export interface QuarterlyInsights {
  evolvedMilestones: Milestone[];
  evolvedPillars: PillarReview[];
  blockedMilestones: Milestone[];
  validatedCandidates: Milestone[];
  bottleneckPillar: PillarType | null;
  audienceResponseChangePct: number | null;
  realDemand: {
    showsRequestedDelta: number;
    showsConfirmedDelta: number;
    superFansDelta: number;
  };
}

function isWithinQuarter(dateStr: string | undefined, quarter: number, year: number): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const dateQuarter = Math.floor(date.getMonth() / 3) + 1;
  return date.getFullYear() === year && dateQuarter === quarter;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Heuristic — there is no progress-change history stored today, so "sem variação
// há mais de 30 dias" is approximated by "iniciado há mais de 30 dias e ainda em
// andamento". Needs refinement once milestone history is tracked.
function isStalled(milestone: Milestone, now: number): boolean {
  if (milestone.status !== 'em_andamento' || !milestone.startDate) return false;
  return now - new Date(milestone.startDate).getTime() > THIRTY_DAYS_MS;
}

function averageTrend(data: number[] | undefined): { firstHalf: number; secondHalf: number } | null {
  if (!data || data.length < 2) return null;
  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid).reduce((s, v) => s + v, 0);
  const secondHalf = data.slice(mid).reduce((s, v) => s + v, 0);
  return { firstHalf, secondHalf };
}

function pctChange(from: number, to: number): number | null {
  if (from === 0) return to === 0 ? 0 : null;
  return Math.round(((to - from) / from) * 100);
}

export function computeQuarterlyInsights(
  project: Project,
  milestones: Milestone[],
  pillarReviews: PillarReview[],
  demandMetrics: DemandMetrics[],
  socialSnapshot: SocialMetricsSnapshot,
  now: number = Date.now(),
): QuarterlyInsights {
  const evolvedMilestones = milestones.filter(
    m => m.status === 'concluido' && isWithinQuarter(m.deadline, project.currentQuarter, project.currentYear),
  );

  const evolvedPillars = pillarReviews.filter(pr => pr.progress > pr.previousProgress);

  const blockedMilestones = milestones.filter(
    m => m.status === 'atrasado' || isStalled(m, now),
  );

  const validatedCandidates = milestones.filter(m => m.status === 'concluido');

  const bottleneckPillar = pillarReviews.length > 0
    ? pillarReviews.reduce((min, pr) => (pr.progress < min.progress ? pr : min), pillarReviews[0]).pillarType
    : null;

  const reachTrend = averageTrend(socialSnapshot.instagram.reachOverTime?.trend?.data)
    ?? averageTrend(socialSnapshot.facebook.pageReach?.trend?.data);
  const audienceResponseChangePct = reachTrend ? pctChange(reachTrend.firstHalf, reachTrend.secondHalf) : null;

  const latest = demandMetrics[demandMetrics.length - 1];
  const previous = demandMetrics.length > 1 ? demandMetrics[demandMetrics.length - 2] : undefined;
  const realDemand = {
    showsRequestedDelta: latest ? latest.shows.requested - (previous?.shows.requested ?? 0) : 0,
    showsConfirmedDelta: latest ? latest.shows.confirmed - (previous?.shows.confirmed ?? 0) : 0,
    superFansDelta: latest ? latest.community.superFansActive - (previous?.community.superFansActive ?? 0) : 0,
  };

  return {
    evolvedMilestones,
    evolvedPillars,
    blockedMilestones,
    validatedCandidates,
    bottleneckPillar,
    audienceResponseChangePct,
    realDemand,
  };
}
