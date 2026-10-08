// Illustrative rates; confirm commercial terms before accepting payments.
export const rates = { transcription: 0.012, clinical: 0.024 };
export function calculateCost(minutes, service) {
  if (!Number.isFinite(minutes) || minutes < 0 || !Object.hasOwn(rates, service)) throw new RangeError("Invalid usage estimate");
  return Math.round(minutes * rates[service] * 100) / 100;
}
