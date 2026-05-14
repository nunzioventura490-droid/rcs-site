import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  query, where, orderBy, serverTimestamp, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const cfg = {
  apiKey: "AIzaSyAQG5BPuNLtNSv6kn6-0D22RhLX9BUonO8",
  authDomain: "rcs-tesi.firebaseapp.com",
  projectId: "rcs-tesi",
  storageBucket: "rcs-tesi.firebasestorage.app",
  messagingSenderId: "634306333804",
  appId: "1:634306333804:web:462baf0285d05e57da9c49"
};

const app = getApps().length ? getApps()[0] : initializeApp(cfg);
export const db = getFirestore(app);

export async function submitOrder(order) {
  try {
    const ref = await addDoc(collection(db, 'ordini'), {
      ...order, createdAt: serverTimestamp(), status: 'pending'
    });
    return { ok: true, id: ref.id };
  } catch (e) { return { ok: false, err: e.message }; }
}

export async function getOrders(clientId = null) {
  try {
    const col = collection(db, 'ordini');
    const q = clientId
      ? query(col, where('clientId', '==', clientId), orderBy('createdAt', 'desc'))
      : query(col, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return []; }
}

export async function updateOrderStatus(id, status) {
  try {
    await updateDoc(doc(db, 'ordini', id), { status });
    return true;
  } catch { return false; }
}
