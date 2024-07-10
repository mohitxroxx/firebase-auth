import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json'
import 'dotenv/config'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: `https://${process.env.projectId}.firebaseio.com`
});

export default admin;
