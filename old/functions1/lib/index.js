"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require("firebase-admin");
//import * as algoliasearch from 'algoliasearch';
const algoliasearch = require("algoliasearch");
const ALGOLIA_APP_ID = "8I5VGLVBT1";
const ALGOLIA_ADMIN_KEY = "48b207b10886fb32395d5b3ad97f338f";
const ALGOLIA_INDEX_NAME = "PostJob";
admin.initializeApp(functions.config().firebase);
// const env = functions.config();
// // Initialize the Algolia Client
// const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
// const index = client.initIndex('PostJob');
exports.addFirestoreDataToAlgoloa = functions.https.onRequest((req, res) => {
    var arr = [];
    admin.firestore().collection("PostJob").get().then((docs) => {
        docs.forEach((doc) => {
            let job = doc.data();
            job.objectID = doc.id;
            arr.push(job);
        });
        var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
        var index = client.initIndex(ALGOLIA_INDEX_NAME);
        index.saveObjects(arr, function (err, content) {
            res.status(200).send(content);
        });
    });
});
//# sourceMappingURL=index.js.map