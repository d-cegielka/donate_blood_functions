// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
//const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
//const sinon = require('sinon');

const admin = require('firebase-admin');

const projectConfig = {
    databaseURL: 'https://donate-blood-f6b61.firebaseio.com',
    storageBucket: 'donate-blood-f6b61.appspot.com',
    projectId: 'donate-blood-f6b61',
};

const test = require('firebase-functions-test')(projectConfig, 'donate-blood-f6b61-bc3b71e26e0d.json');

describe('Cloud Functions', () => {
    let myFunctions;

    before(() => {
        // Require index.js and save the exports inside a namespace called myFunctions.
        // This includes our cloud functions, which can now be accessed at myFunctions.makeUppercase
        // and myFunctions.addMessage
        myFunctions = require('../index.js');
    });

    after(() => {
        // Do cleanup tasks.
        test.cleanup();
        // Reset the database.
        admin.database().ref('messages').remove();
    });

    describe('newDonationNotification', () => {
        it('should send donation notification', () => {
            const donation = test.firestore.makeDocumentSnapshot(
                {
                    'amount': 500,
                    'userId': admin.firestore().doc('/users/ScIsrTlNend4usG7v5aLsxbsabC2'),
                    'nurseId': admin.firestore().doc('/users/8nlVvZc81PPthyepvgrPzX02c4A3'),
                    'donationType': 'Whole blood',
                    'donationDate': new Date()
                }, 'donations'
            )

            const wrapped = test.wrap(myFunctions.newDonationNotification);

            return wrapped(donation);
        });
    })

    describe('newEventNotification', () => {
        it('should send event notification', () => {
            const event = test.firestore.makeDocumentSnapshot(
                {
                    'donationType': 'Whole blood',
                    'location': 'Warszawa',
                    'eventType': 'normal',
                    'date': new Date()
                }, 'donations'
            )

            const wrapped = test.wrap(myFunctions.newEventNotification);

            return wrapped(event);
        });
    })
})


