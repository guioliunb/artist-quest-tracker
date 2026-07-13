import sampleRaw from './social-metrics-sample.json';
import { SocialMetricsSnapshot, SocialMetricValue } from '@/types';

interface RawResult {
  slug: string;
  response?: Record<string, SocialMetricValue>;
}

interface RawSnapshot {
  period: { start: string; end: string };
  results: RawResult[];
}

function getMetric(data: RawSnapshot, slug: string, key: string): SocialMetricValue | undefined {
  const result = data.results.find(r => r.slug === slug);
  return result?.response?.[key];
}

// Mock adapter — reads an aggregator-shaped export as-is. A future real integration
// swaps this function's body for an API call; consumers only see SocialMetricsSnapshot.
// Accepts the raw export as a parameter so different datasets (standard vs. demo mode)
// can share the same adapter.
export function buildSocialMetricsSnapshot(raw: unknown): SocialMetricsSnapshot {
  const data = raw as unknown as RawSnapshot;
  return {
    period: data.period,
    facebook: {
      pageReach: getMetric(data, 'facebook', 'fb:page_reach') ?? getMetric(data, 'facebook', 'fb:page_reach_total'),
      postEngagements: getMetric(data, 'facebook', 'fb:page_post_engagements'),
      postEngagementRate: getMetric(data, 'facebook', 'fb:page_post_rate_engagements'),
      videoViews: getMetric(data, 'facebook', 'fb:total_video_views'),
    },
    instagram: {
      profileViews: getMetric(data, 'instagram_business', 'ig:profile_views'),
      views: getMetric(data, 'instagram_business', 'ig:views'),
      storiesViews: getMetric(data, 'instagram_business', 'ig:stories_views'),
      reachOverTime: getMetric(data, 'instagram_business', 'ig:reach_over_time'),
    },
    tiktok: {
      views: getMetric(data, 'tiktok', 'tiktok:views'),
      likes: getMetric(data, 'tiktok', 'tiktok:likes'),
      comments: getMetric(data, 'tiktok', 'tiktok:comments'),
      shares: getMetric(data, 'tiktok', 'tiktok:share'),
      follows: getMetric(data, 'tiktok', 'tiktok:follows'),
    },
    youtube: {
      views: getMetric(data, 'youtube', 'youtube:views'),
      likes: getMetric(data, 'youtube', 'youtube:likes'),
      comments: getMetric(data, 'youtube', 'youtube:comments'),
      shares: getMetric(data, 'youtube', 'youtube:shares'),
      subscribersVariation: getMetric(data, 'youtube', 'youtube:subscribers_variation'),
    },
  };
}

export function getSocialMetricsSnapshot(raw: unknown = sampleRaw): SocialMetricsSnapshot {
  return buildSocialMetricsSnapshot(raw);
}
