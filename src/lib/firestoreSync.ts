import { collection, doc, setDoc, getDocs, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Synchronizes key speech practice data and audit events to Firebase Firestore
 */

export async function syncUserToFirestore(user: { id: string; name: string; email: string; role: string }) {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      syncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Firestore syncUser notice:', err);
    return false;
  }
}

export async function syncAnalysisToFirestore(result: {
  id: string;
  childId: string;
  targetWord: string;
  targetPhoneme: string;
  position: string;
  isMatch: boolean;
  confidence: number;
  gopScore: number;
  childFeedback: string;
  timestamp: string;
}) {
  try {
    const analysisRef = doc(db, 'speechAnalyses', result.id);
    await setDoc(analysisRef, result, { merge: true });
    return true;
  } catch (err) {
    console.warn('Firestore syncAnalysis notice:', err);
    return false;
  }
}

export async function syncTwinToFirestore(twin: any) {
  try {
    if (!twin || !twin.childId) return false;
    const twinRef = doc(db, 'speechDigitalTwins', twin.childId);
    await setDoc(twinRef, {
      ...twin,
      syncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Firestore syncTwin notice:', err);
    return false;
  }
}

export async function getFirebaseStatus(): Promise<{ connected: boolean; projectId: string; databaseId: string }> {
  try {
    // Quick probe to verify Firestore connection
    const probeDoc = doc(db, 'system', 'connectivity_check');
    await setDoc(probeDoc, { lastPing: new Date().toISOString() }, { merge: true });
    return {
      connected: true,
      projectId: 'heroic-source-853bd',
      databaseId: 'ai-studio-insightstream-b7227fc2-1c4c-4253-a22e-3ef7a5df14b3'
    };
  } catch (err) {
    return {
      connected: false,
      projectId: 'heroic-source-853bd',
      databaseId: 'ai-studio-insightstream-b7227fc2-1c4c-4253-a22e-3ef7a5df14b3'
    };
  }
}
