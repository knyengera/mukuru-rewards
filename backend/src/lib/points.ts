export type Tier = 'bronze' | 'silver' | 'gold';

export function calculateBasePoints(amountZar: number): number {
  if (!Number.isFinite(amountZar) || amountZar <= 0) return 0;
  return Math.floor(amountZar / 100);
}

export function determineTier(lifetimePoints: number): Tier {
  if (lifetimePoints >= 2000) return 'gold';
  if (lifetimePoints >= 500) return 'silver';
  return 'bronze';
}

export function applyTierMultiplier(points: number, tier: Tier): number {
  const multiplier = tier === 'gold' ? 1.25 : tier === 'silver' ? 1.1 : 1.0;
  return Math.floor(points * multiplier);
}


