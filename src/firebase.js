
  import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyDZDVPf8dInID5SfciN7kj5ukII8zOJN2g",
    authDomain: "insta-clone-b8655.firebaseapp.com",
    databaseURL: "https://insta-clone-b8655.firebaseio.com",
    projectId: "insta-clone-b8655",
    storageBucket: "insta-clone-b8655.appspot.com",
    messagingSenderId: "887391562313",
    appId: "1:887391562313:web:ecaad984181ffbce3eed98"
  };


  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore()

  const auth = firebase.auth()

  const storage = firebase.storage()



  export {db,auth,storage}


  export default db;