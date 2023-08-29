import { db } from '../../main.js';
import { ScoreAdjustment, scoreAdjustmentConverter } from '../../models/ScoreAdjustment.js';

export const adjustScore = (adj: ScoreAdjustment) => {
  return db.collection('scoreAdjustments').withConverter(scoreAdjustmentConverter).add(adj);
};
