import { WithFieldValue, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const userConverter = {
  toFirestore(user: WithFieldValue<User>) {
    return { socialCreditScore: user.socialCreditScore };
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
