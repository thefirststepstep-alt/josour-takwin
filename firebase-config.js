// ====================================================
// Firebase Cloud Database Config & Synchronization
// Project: josour-moidat
// ====================================================

const firebaseConfig = {
  apiKey: "AIzaSyCWdABh8Ho-J5hjF-1AqnAY2gU37vj3HX4",
  authDomain: "josour-moidat.firebaseapp.com",
  projectId: "josour-moidat",
  storageBucket: "josour-moidat.firebasestorage.app",
  messagingSenderId: "197055937924",
  appId: "1:197055937924:web:1521af748b33b8d99531d1"
};

let dbFirestore = null;

function initFirebaseCloud() {
  if (typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      dbFirestore = firebase.firestore();
      console.log("🟢 Firebase Cloud Connected Successfully:", firebaseConfig.projectId);

      // Listen for Real-Time Updates from Firebase Cloud
      dbFirestore.collection("josour_takwin").doc("app_state").onSnapshot((doc) => {
        if (doc.exists) {
          const cloudData = doc.data();
          if (cloudData && cloudData.docTitle) {
            window.appState = cloudData;
            safeSetStorage('josour_takwin_state', JSON.stringify(window.appState));
            if (typeof renderAll === 'function') renderAll();
          }
        }
      }, (error) => {
        console.warn("⚠️ Firebase Rules Notice: Ensure Firestore rules allow read/write (allow read, write: if true;)", error.message);
      });
    } catch (e) {
      console.error("Firebase Initialization Notice:", e.message);
    }
  }
}

function syncStateToFirebase(stateData) {
  if (dbFirestore) {
    try {
      dbFirestore.collection("josour_takwin").doc("app_state").set(stateData, { merge: true })
        .then(() => console.log("☁️ Saved to Firebase Cloud"))
        .catch((err) => console.warn("⚠️ Firebase Save Warning: Check Rules in Firebase Console!", err.message));
    } catch (e) {
      console.error("Firebase Sync Error:", e.message);
    }
  }
}

// Auto-run init on load
document.addEventListener('DOMContentLoaded', () => {
  initFirebaseCloud();
});