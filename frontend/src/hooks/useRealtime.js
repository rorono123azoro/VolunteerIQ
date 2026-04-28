import { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { rtdb } from '../services/firebase';

/**
 * Subscribe to Firebase Realtime Database for live event attendance
 */
export function useRealtimeAttendance(eventId) {
  const [volunteers, setVolunteers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const eventRef = ref(rtdb, `live_events/${eventId}/volunteers`);
    const unsubscribe = onValue(eventRef, (snapshot) => {
      const data = snapshot.val() || {};
      setVolunteers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  const checkIn = async (volunteerId) => {
    const volRef = ref(rtdb, `live_events/${eventId}/volunteers/${volunteerId}`);
    await set(volRef, {
      status: 'checked_in',
      lastSeen: Date.now(),
    });
  };

  const checkOut = async (volunteerId) => {
    const volRef = ref(rtdb, `live_events/${eventId}/volunteers/${volunteerId}`);
    await remove(volRef);
  };

  return { volunteers, loading, checkIn, checkOut };
}
