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
    return db.collection("users").doc(user.uid).set({
        bloodGroup: '',
        dateOfBirth: '',
        fullName: '',
        gender: '',
        phoneNumber: '',
        isNurse: false
    }).catch(console.error);
};

const deleteUserProfile = (user) => {
    return db.collection("users").doc(user.uid).delete().catch(console.error);
};

const sendNewEventNotification = (snapshot, context) => {
    const event = snapshot.data();

    let message = {
        data: {
            type: 'new_event',
            location: event.location,
            eventDate: event.date.toMillis().toString()
        },
        notification: {
            title: 'Nowa zbiórka krwi!',
            body: event.date.toDate().toLocaleString('pl-PL') + ', ' + event.location
        }
    }

    admin.messaging().sendToTopic('event', message).then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
        return event;
    }).catch((error) => {
        console.log('Error sending message:', error);
    });

};

const sendNewDonateNotification = async (snapshot, context) => {
    const donation = snapshot.data();

    const userData = await donation.userId.get();
    let sendToTokens = userData.get('tokens');

    let message = {
        data: {
            type: 'new_donation',
            amount: donation.amount.toString(),
            donationDate: donation.donationDate.toMillis().toString(),
            donationType: donation.donationType
        },
        android: {
            priority: 'normal',
            notification: {
                title: 'Pojawiła się nowa donacja na twoim koncie!',
                body: donation.donationDate.toDate().toLocaleString('pl-PL')
            },
        },
        tokens: sendToTokens
    }

    admin.messaging().sendMulticast(message).then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
        return donation;
    }).catch((error) => {
        console.log('Error sending message:', error);
    });

}

module.exports = {
    authOnCreate: functions.auth.user().onCreate(createUserProfile),
    authOnDelete: functions.auth.user().onDelete(deleteUserProfile),
    newEventNotification: functions.firestore.document('events/{docId}').onCreate(sendNewEventNotification),
    newDonationNotification: functions.firestore.document('donations/{docId}').onCreate(sendNewDonateNotification)
};