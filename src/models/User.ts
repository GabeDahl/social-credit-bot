import { WithFieldValue, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const userConverter = {
  toFirestore(adj: WithFieldValue<User>) {
    return { socialCreditScore: adj.socialCreditScore };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    const data = snapshot.data() as User;
    data.id = snapshot.id;
    return data;
  },
};
export interface User {
  id: string;
  socialCreditScore: number;
}
