import { NlpManager } from 'node-nlp';
import { TrainingDocument } from './TrainingDocument.js';
export class NlpMachine {
  private manager: NlpManager;
  constructor(nlpManager: NlpManager = new NlpManager({ languages: ['en'] })) {
    this.manager = nlpManager;
  }
  loadData(docs: TrainingDocument[]) {
    docs.forEach(({ locale, utterance, intent }) => {
      this.manager.addDocument(locale, utterance, intent);
    });
  }
  async train(): Promise<void> {
    return this.manager.train();
  }
  async process(text: string): Promise<{ intent: string; score: number }> {
    return this.manager.process('en', text);
  }
}
