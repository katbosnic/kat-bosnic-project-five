import firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC_H5EWT43-q1rs42VXlOml0LDrcYjL9Rc",
    authDomain: "waste-wise.firebaseapp.com",
    databaseURL: "https://waste-wise.firebaseio.com",
    projectId: "waste-wise",
    storageBucket: "waste-wise.appspot.com",
    messagingSenderId: "33013256112",
    appId: "1:33013256112:web:9b215ee3e8943146"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;