const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();

const db = admin.firestore();


const createUserProfile = (user) => {
    return db.collection("users").doc(user.uid).set({ fullName: '', phoneNumber:'', bloodGroup: '', isNurse: false}).catch(console.error);
};

const deleteUserProfile = (user) => {
    return db.collection("users").doc(user.uid).delete().catch(console.error);
};


module.exports = {
    authOnCreate: functions.auth.user().onCreate(createUserProfile),
    authOnDelete: functions.auth.user().onDelete(deleteUserProfile),
    eventOnAdded: functions.firestore.document('events/{docId}').onCreate(
        (change, context) => {
            //TODO
        }
    ),
};