import { db } from '../../main.js';
import { userConverter } from '../../models/User.js';
import { CollectionReference } from 'firebase-admin/firestore';
let _usersCollection: CollectionReference;
const getUsersCollection = () => {
  if (!_usersCollection) {
    _usersCollection = db.collection('users').withConverter(userConverter);
  }
  return _usersCollection;
};
export const syncUsers = async (userIds: string[]) => {
  console.log(`userIds: ${userIds}`);
  const batch = db.batch();

  await Promise.all(
    userIds.map(async (id) => {
      const userRef = getUsersCollection().doc(id);
      const doc = await userRef.get();
      if (!doc.exists) {
        console.log('doesnt exist');
        batch.set(
          userRef,
          { id: id, socialCreditScore: 500 },
          {
            merge: true,
          },
        );
      }
    }),
  );

  return batch.commit();
};

export const getUser = async (id: string) => {
  const userRef = await getUsersCollection().doc(id).get();
  return userRef.data();
};
