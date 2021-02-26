import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBjRqw4bkDiHWcHPJw8jiRkv_j0qf-YcMs",
  authDomain: "dask-d821d.firebaseapp.com",
  projectId: "dask-d821d",
  storageBucket: "dask-d821d.appspot.com",
  messagingSenderId: "399315438523",
  appId: "1:399315438523:web:70b3027d18faa0a3f9929e",
};

firebase.initializeApp(firebaseConfig);

export const { auth } = firebase;
export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const GithubProvider = new firebase.auth.GithubAuthProvider();
