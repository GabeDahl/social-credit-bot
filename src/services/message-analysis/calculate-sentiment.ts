export const calculateSentiment = (intent: string, score: number): number => {
  if (Math.abs(score) < 0.8) return 0;
  if (intent === 'None') return 0;
  return intent === 'positive' ? score : score * -1;
};
