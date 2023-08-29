import { calculateSentiment } from '../../../src/services/message-analysis/calculate-sentiment.js';

describe('calculate sentiment', () => {
  it('should return a negative value for intents that are negative', () => {
    expect(calculateSentiment('negative', 0.87)).toBeLessThan(0);
  });
  it('should return a positive value for intents that are positive', () => {
    expect(calculateSentiment('positive', 0.87)).toBeGreaterThan(0);
  });
  it('should return 0 if no intent', () => {
    expect(calculateSentiment('None', 0)).toBe(0);
  });
  it('should return 0 if score is not confident', () => {
    expect(calculateSentiment('positive', 0.3)).toBe(0);
  });
});
