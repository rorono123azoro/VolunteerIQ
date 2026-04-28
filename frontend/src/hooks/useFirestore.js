import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Subscribe to a Firestore document in real time
 */
export function useFirestoreDoc(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (snap) => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}

/**
 * Subscribe to a Firestore collection query in real time
 */
export function useFirestoreCollection(collectionName, constraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

/**
 * Fetch a Firestore collection once (no real-time)
 */
export function useFirestoreQuery(collectionName, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, collectionName), ...queryConstraints);
        const snapshot = await getDocs(q);
        setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { data, loading, error, refetch: () => setLoading(true) };
}
