const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// 1. Auto-update volunteer stats when attendance is marked as completed
exports.updateTotalHours = functions.firestore
  .document('attendance/{attendanceId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    // Check if status changed to 'completed'
    if (newData.status === 'completed' && oldData.status !== 'completed') {
      const volunteerId = newData.volunteerId;
      const hoursLogged = newData.hoursLogged || 0;

      if (!volunteerId || hoursLogged <= 0) return null;

      const userRef = db.collection('users').doc(volunteerId);
      
      return db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (!userDoc.exists) return;

        const currentHours = userDoc.data().totalHours || 0;
        const eventsAttended = userDoc.data().eventsAttended || 0;

        t.update(userRef, {
          totalHours: currentHours + hoursLogged,
          eventsAttended: eventsAttended + 1
        });
      });
    }
    return null;
  });

// 2. Auto-set opportunity status to 'full' when volunteersRegistered hits volunteersNeeded
exports.checkOpportunityCapacity = functions.firestore
  .document('opportunities/{opportunityId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    const currentRegistered = newData.volunteersRegistered || 0;
    const oldRegistered = oldData.volunteersRegistered || 0;
    const needed = newData.volunteersNeeded || 0;

    // Only update if registered count increased and reached capacity
    if (currentRegistered > oldRegistered && currentRegistered >= needed && newData.status === 'open') {
      return change.after.ref.update({
        status: 'full'
      });
    }
    return null;
  });

// 3. Update volunteersRegistered count when a new application is accepted
exports.incrementRegisteredCount = functions.firestore
  .document('applications/{applicationId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    if (newData.status === 'accepted' && oldData.status !== 'accepted') {
      const opportunityId = newData.opportunityId;
      if (!opportunityId) return null;

      const oppRef = db.collection('opportunities').doc(opportunityId);
      return oppRef.update({
        volunteersRegistered: admin.firestore.FieldValue.increment(1)
      });
    }
    return null;
  });
