import { db } from './supabaseClient.js';
import { collection, getDocs, doc, getDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { mockData, delay } from './mockData.js';

export const dataService = {
  async getPraxisInfo() {
    try {
      const docRef = doc(db, 'praxis_info', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return mockData.praxisInfo;
    } catch (error) {
      console.error('Error fetching praxis info:', error);
      return mockData.praxisInfo;
    }
  },

  async getOpeningHours() {
    try {
      const q = query(collection(db, 'opening_hours'), orderBy('display_order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return data.length > 0 ? data : mockData.openingHours;
    } catch (error) {
      console.error('Error fetching opening hours:', error);
      return mockData.openingHours;
    }
  },

  async getTreatments() {
    try {
      const q = query(
        collection(db, 'treatments'),
        where('active', '==', true),
        orderBy('created_at', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return data.length > 0 ? data : mockData.treatments;
    } catch (error) {
      console.error('Error fetching treatments:', error);
      return mockData.treatments;
    }
  },

  async getVideos() {
    try {
      const q = query(
        collection(db, 'videos'),
        where('active', '==', true),
        orderBy('created_at', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return data.length > 0 ? data : mockData.videos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return mockData.videos;
    }
  },

  async getAftercare() {
    try {
      const q = query(
        collection(db, 'aftercare'),
        where('active', '==', true),
        orderBy('created_at', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return data.length > 0 ? data : mockData.aftercare;
    } catch (error) {
      console.error('Error fetching aftercare:', error);
      return mockData.aftercare;
    }
  },

  async getDesignSettings() {
    try {
      const docRef = doc(db, 'design_settings', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return mockData.designSettings;
    } catch (error) {
      console.error('Error fetching design settings:', error);
      return mockData.designSettings;
    }
  },

  async getEmergencyInfo() {
    try {
      const docRef = doc(db, 'emergency_info', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return mockData.emergencyInfo;
    } catch (error) {
      console.error('Error fetching emergency info:', error);
      return mockData.emergencyInfo;
    }
  },

  async getNews() {
    try {
      const q = query(
        collection(db, 'news'),
        where('published', '==', true),
        orderBy('display_order', 'desc'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return data.length > 0 ? data : mockData.news;
    } catch (error) {
      console.error('Error fetching news:', error);
      return mockData.news;
    }
  },

  subscribeToTable(collectionName, callback) {
    try {
      const q = query(collection(db, collectionName));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(`Change in ${collectionName}:`, change.type, change.doc.data());
          callback({
            eventType: change.type,
            new: { id: change.doc.id, ...change.doc.data() },
            old: change.type === 'removed' ? { id: change.doc.id, ...change.doc.data() } : null
          });
        });
      });
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to collection:', error);
      return null;
    }
  },

  unsubscribe(unsubscribeFn) {
    if (unsubscribeFn && typeof unsubscribeFn === 'function') {
      unsubscribeFn();
    }
  }
};
