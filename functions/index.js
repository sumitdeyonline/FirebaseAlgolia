

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// Firebase deploy --only functions
// https://us-central1-jobsite-c8333.cloudfunctions.net/addFirestoreDataToAlgolia

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');


const ALGOLIA_APP_ID = "8I5VGLVBT1";
const ALGOLIA_ADMIN_KEY = "48b207b10886fb32395d5b3ad97f338f";
const ALGOLIA_INDEX_NAME = "UserProfile";

admin.initializeApp(functions.config().firebase);


/*exports.addFirestoreDataToAlgolia = functions.https.onRequest((req, res) => {

	var arr = [];
	admin.firestore().collection("UserProfile").get().then((docs) => {
		docs.forEach((doc) => {
			let rdata = doc.data();
			rdata.objectID = doc.id;

			arr.push(jsite);

		})
		var client = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
		var index = client.initIndex(ALGOLIA_INDEX_NAME);
		index.saveObjects(arr, function (err, content) {
			res.status(200).send(content);
		})
        return null;

	}).catch(error => {
        console.error(error);
        res.error(500);
    });

})*/



const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

exports.updateIndex = functions.database.ref('/UserProfile/{userId}').onWrite(event => {

  const index = algolia.initIndex(UserProfile);

  const userId = event.params.userId
  const data = event.data.val()


  if (!data) {
    return index.deleteObject(userId, (err) => {
      if (err) throw err
      console.log('Resume Removed from Algolia Index', userId)
    })

  }

  data['objectID'] = userId

  return index.saveObject(data, (err, content) => {
    if (err) throw err
    console.log('Resume Updated in Algolia Index', data.objectID)
  })


});
