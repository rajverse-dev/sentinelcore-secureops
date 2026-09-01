export type MetricKey = 'cpu' | 'memory' | 'disk' | 'network';

export type LiveMetrics = Record<MetricKey, number>;

export const initialLiveMetrics: LiveMetrics = {
  cpu: 23,
  memory: 47,
  disk: 67,
  network: 12
};

export function createLiveMetricSnapshot(): LiveMetrics {
  return { ...initialLiveMetrics };
}

export function advanceMetricSnapshot(current: LiveMetrics): LiveMetrics {
  const next: LiveMetrics = { ...current };

  (Object.keys(next) as MetricKey[]).forEach((key) => {
    const base = current[key];
    const drift = (Math.random() - 0.5) * 6;
    const adjusted = base + drift;

    if (key === 'cpu') {
      next[key] = clamp(adjusted, 18, 38);
    } else if (key === 'memory') {
      next[key] = clamp(adjusted, 41, 60);
    } else if (key === 'disk') {
      next[key] = clamp(adjusted, 60, 78);
    } else {
      next[key] = clamp(adjusted, 8, 18);
    }
  });

  return next;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
