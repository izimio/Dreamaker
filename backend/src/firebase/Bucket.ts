import admin from 'firebase-admin';
import credObj from "./firebase-pk.json";

import { BUCKET_URL } from '../utils/config';
admin.initializeApp({
  credential: admin.credential.cert(credObj as admin.ServiceAccount),
  storageBucket: BUCKET_URL,
});

const Bucket = admin.storage().bucket();

if (!Bucket) {
  throw new Error('Invalid Bucket Configuration');
}

export default Bucket;