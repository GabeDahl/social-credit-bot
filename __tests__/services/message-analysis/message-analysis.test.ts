import { positiveStatements } from '../../../src/services/message-analysis/training-data/positive.js';
import { negativeStatements } from '../../../src/services/message-analysis/training-data/negative.js';
import { TrainingDocument } from '../../../src/models/message-analysis/TrainingDocument.js';
import { NlpMachine } from '../../../src/models/message-analysis/NlpMachine.js';
import { neutralStatements } from '../../../src/services/message-analysis/training-data/neutral.js';

describe('Sentiment Analysis Message Processing', () => {
  let nlpMachine: NlpMachine;
  const originalLog = console.log;
  beforeAll(async () => {
    console.log = jest.fn();
    nlpMachine = new NlpMachine();
    const docs: TrainingDocument[] = [];
    positiveStatements.forEach((stmt) => {
      docs.push({ locale: 'en', utterance: stmt, intent: 'positive' });
    });
    negativeStatements.forEach((stmt) => {
      docs.push({ locale: 'en', utterance: stmt, intent: 'negative' });
    });
    neutralStatements.forEach((stmt) => {
      docs.push({ locale: 'en', utterance: stmt, intent: 'None' });
    });

    nlpMachine.loadData(docs);
    return nlpMachine.train();
  });

  afterAll(() => {
    console.log = originalLog;
  });

  it('should positively classify statements that praise authoritarianism', async () => {
    const { intent, score } = await nlpMachine.process('big government knows best');
    expect(intent).toBe('positive');
    expect(score).toBeGreaterThan(0.5);
  });
  it('should negatively classify statements that criticize authoritarianism', async () => {
    const { intent, score } = await nlpMachine.process('surveillance states are evil and oppresive');

    expect(intent).toBe('negative');
    expect(score).toBeGreaterThan(0.5);
  });

  it('should positively classify statements that criticize freedom', async () => {
    const { intent, score } = await nlpMachine.process('freedom is bad');
    expect(intent).toBe('positive');
    expect(score).toBeGreaterThan(0.5);
  });

  it('should negatively classify statements that praise freedom', async () => {
    const { intent, score } = await nlpMachine.process('freedom is good');
    expect(intent).toBe('negative');
    expect(score).toBeGreaterThan(0.5);
  });

  it('should not classify neutral statements', async () => {
    const { intent } = await nlpMachine.process(`I've gotta buy some milk.`);
    expect(intent).toBe('None');
  });
});
