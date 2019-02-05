

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// Firebase deploy --only functions
//  https://us-central1-jobsite-c8333.cloudfunctions.net/addFirestoreUserProfileDataToAlgolia
// https://us-central1-jobsite-c8333.cloudfunctions.net/addFirestorePostJobDataToAlgolia

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');
//var cors = require('cors'); 
// const cors = require('cors')({
//   origin: true
// });

const ALGOLIA_APP_ID = "8I5VGLVBT1";
const ALGOLIA_ADMIN_KEY = "48b207b10886fb32395d5b3ad97f338f";
const ALGOLIA_INDEX_NAME_POST_JOB = "PostJob";
const ALGOLIA_INDEX_NAME_USER_PROFILE = "UserProfile";


admin.initializeApp(functions.config().firebase);
//admin.settings({timestampsInSnapshots: true});

const settings = {/* your settings... */ timestampsInSnapshots: true};
//admin.firestore.settings(settings);
//exports.addFirestoreDataToAlgolia = functions.https.onRequest((req, res) => {
exports.addFirestorePostJobDataToAlgolia = functions.https.onRequest((req, res) => {

	var arr = [];
	//admin.firestore().settings({ timestampsInSnapshots: true }).collection("PostJob").get().then((docs) => {
  admin.firestore().collection("PostJob").get().then((docs) => {
		docs.forEach((doc) => {
      let jsite = doc.data();
      jsite.objectID = doc.id;
      console.log("Job Object :::: "+jsite.objectID);
      jsite.CreatedDate = doc.CreatedDate.toDate();
      jsite.LastModifiedDate = doc.LastModifiedDate.toDate();      

			arr.push(jsite);
 
		})
		var client = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
		var index = client.initIndex(ALGOLIA_INDEX_NAME_POST_JOB);
		index.saveObjects(arr, function (err, content) {
			res.status(200).send(content);
		})
        return null;

	}).catch(error => {
        console.error(error);
        res.error(500);
    });

})

exports.addFirestoreUserProfileDataToAlgolia = functions.https.onRequest((req, res) => {

	var arr = [];
	admin.firestore().collection("UserProfile").get().then((docs) => {
		docs.forEach((doc) => {
			let jsite = doc.data();
			jsite.objectID = doc.id;

			arr.push(jsite);

		})
		var client = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
		var index = client.initIndex(ALGOLIA_INDEX_NAME_USER_PROFILE);
		index.saveObjects(arr, function (err, content) {
			res.status(200).send(content);
		})
        return null;

	}).catch(error => {
        console.error(error);
        res.error(500);
    });

})


const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

exports.updateIndexPostJob = functions.database.ref('/PostJob/{jobId}').onWrite(event => {

  const index = algolia.initIndex(PostJob);

  const jobId = event.params.jobId
  const data = event.data.val()


  if (!data) {
    return index.deleteObject(jobId, (err) => {
      if (err) throw err
      console.log('Job Removed from Algolia Index', jobId)
    })

  }

  data['objectID'] = jobId

  return index.saveObject(data, (err, content) => {
    if (err) throw err
    console.log('Job Updated in Algolia Index', data.objectID)
  })


});

exports.updateIndexUserProfile = functions.database.ref('/UserProfile/{userId}').onWrite(event => {

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

