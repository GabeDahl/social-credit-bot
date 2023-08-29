import { Timestamp, WithFieldValue, FieldValue, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const scoreAdjustmentConverter = {
  toFirestore(adj: WithFieldValue<ScoreAdjustment>) {
    return { amount: adj.amount, time: FieldValue.serverTimestamp(), userId: adj.userId };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ScoreAdjustment {
    const data = snapshot.data() as ScoreAdjustment;
    data.id = snapshot.id;
    return data;
  },
};
export interface ScoreAdjustment {
  id?: string;
  amount: number;
  time?: Timestamp | FieldValue;
  userId: string;
}
