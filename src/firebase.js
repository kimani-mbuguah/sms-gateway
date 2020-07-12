import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import africaistalking from 'africaistalking';

const firebaseConfig = {
  apiKey: 'AIzaSyBvqwFqWbnI3rke-SZS2CrRo4pCdvphcbQ',
  authDomain: 'mageelaw-83ee2.firebaseapp.com',
  databaseURL: 'https://mageelaw-83ee2.firebaseio.com',
  projectId: 'mageelaw-83ee2',
  storageBucket: 'mageelaw-83ee2.appspot.com',
  messagingSenderId: '239619446823',
  appId: '1:239619446823:web:a3828ceec7c44c3c92d602',
  measurementId: 'G-7DT0F3Y7L1'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const countUsers = async uid => {
  if (!uid) return;
  return new Promise((resolve, reject) => {
    firestore
      .doc(`apps/${uid}`)
      .collection('users')
      .get()
      .then(snapshot => {
        resolve(snapshot.size);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const countGroups = async uid => {
  if (!uid) return;
  return new Promise((resolve, reject) => {
    firestore
      .doc(`apps/${uid}`)
      .collection('groups')
      .get()
      .then(snapshot => {
        resolve(snapshot.size);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const generateAppDocument = async (user, senderID, userName, apiKey) => {
  if (!user) return;

  const appRef = firestore.doc(`apps/${user.uid}`);
  const snapshot = await appRef.get();

  if (!snapshot.exists) {
    try {
      await appRef.set({
        senderID: senderID,
        userName: userName,
        apiKey: apiKey,
        email: user.email,
        active: false
      });
    } catch (error) {
      console.error('Error creating app document', error);
      return error;
    }
  }
  return getAppDocument(user.uid);
};

const getAppDocument = async uid => {
  if (!uid) return null;
  try {
    const appDocument = await firestore.doc(`apps/${uid}`).get();

    return {
      uid,
      ...appDocument.data()
    };
  } catch (error) {
    console.error('Error fetching app', error);
    return error;
  }
};

export const generateUserDocument = async (uid, name, phone) => {
  if (!uid) return;

  const usersRef = firestore
    .doc(`apps/${uid}`)
    .collection(`users`)
    .doc(phone);
  const snapshot = await usersRef.get();

  if (!snapshot.exists) {
    try {
      await usersRef.set({
        name: name,
        phone: phone
      });
    } catch (error) {
      console.error('Error creating user document', error);
      return error;
    }
  }
  return getUserDocument(uid, phone);
};

export const getUserDocuments = async uid => {
  if (!uid) return null;
  try {
    let usersArr = [];
    const userSnapshot = await firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .get();

    userSnapshot.forEach(doc => {
      usersArr.push(doc.data());
    });

    return {
      usersArr
    };
  } catch (error) {
    console.error('Error fetching users', error);
    return error;
  }
};

export const getUserDocument = async (uid, phone) => {
  if (!uid) return null;
  try {
    const userDocument = await firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .get();

    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error('Error fetching user', error);
  }
};

export const generateGroupDocument = async (uid, name) => {
  if (!uid) return;

  const usersRef = firestore
    .doc(`apps/${uid}`)
    .collection(`groups`)
    .doc(name);
  const snapshot = await usersRef.get();

  if (!snapshot.exists) {
    try {
      await usersRef.set({
        name: name,
        members: []
      });
    } catch (error) {
      console.error('Error creating user document', error);
      return error;
    }
  }
  return getGroupDocument(uid, name);
};

export const generateMemberEntry = async (uid, name, phone) => {
  if (!uid) return;

  const usersRef = firestore
    .doc(`apps/${uid}`)
    .collection(`groups`)
    .doc(name)
    .collection('members')
    .doc(phone);
  const snapshot = await usersRef.get();

  if (!snapshot.exists) {
    try {
      await usersRef.set({
        phone: phone,
        groupname: name
      });
    } catch (error) {
      console.error('Error creating user document', error);
      return error;
    }
  }
  return getGroupDocument(uid, name);
};

export const addAllMembersToGroup = async (groupName, uid) => {
  if (!uid) return;

  try {
    let usersArr = [];
    const userSnapshot = await firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .get();

    userSnapshot.forEach(doc => {
      usersArr.push(doc.data());
    });

    let phoneArr = [];
    let success = false;
    usersArr.forEach(async usrObj => {
      const membersRef = firestore
        .doc(`apps/${uid}`)
        .collection(`groups`)
        .doc(groupName)
        .collection('members')
        .doc(usrObj.phone);

      membersRef
        .set({
          phone: usrObj.phone,
          groupname: groupName
        })
        .then(() => {
          success = true;
          console.log('Document set');
        });
    });

    if (success) {
      return 'success';
    } else {
      return 'error';
    }
  } catch (error) {
    console.error('Error fetching users', error);
    return error;
  }
};

export const getGroupDocument = async (uid, name) => {
  if (!uid) return null;
  try {
    let membersArr = [];
    const memberSnapshot = await firestore
      .doc(`apps/${uid}`)
      .collection(`groups`)
      .doc(name)
      .collection('members')
      .get();

    memberSnapshot.forEach(doc => {
      membersArr.push(doc.data());
    });

    return {
      membersArr
    };
  } catch (error) {
    console.error('Error fetching group', error);
    return error;
  }
};

export const getGroupDocuments = async uid => {
  if (!uid) return null;
  try {
    const groupsArr = [];
    const groupSnapshot = await firestore
      .doc(`apps/${uid}`)
      .collection(`groups`)
      .get();

    groupSnapshot.forEach(doc => {
      groupsArr.push(doc.data());
    });

    return {
      groupsArr
    };
  } catch (error) {
    console.error('Error fetching groups', error);
    return error;
  }
};

export const sendSingleSMS = (phone, message, senderID, userName, apiKey) => {
  return new Promise((resolve, reject) => {
    africaistalking(userName, message, phone, apiKey, senderID)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

export const sendMultiSMS = (phones, message, senderID, userName, apiKey) => {
  const phoneString = phones + '';
  return new Promise((resolve, reject) => {
    africaistalking(userName, message, phoneString, apiKey, senderID)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

export const sendGroupSMS = async (
  groupName,
  message,
  uid,
  senderID,
  userName,
  apiKey
) => {
  if (!uid) return null;
  try {
    let membersArr = [];
    const memberSnapshot = await firestore
      .doc(`apps/${uid}`)
      .collection(`groups`)
      .doc(groupName)
      .collection('members')
      .get();

    memberSnapshot.forEach(doc => {
      membersArr.push(doc.data());
    });

    const phoneArr = [];
    membersArr.forEach(memberObj => {
      phoneArr.push(memberObj.phone);
    });

    const phoneString = phoneArr + '';

    return new Promise((resolve, reject) => {
      africaistalking(userName, message, phoneString, apiKey, senderID)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  } catch (error) {
    console.error('Error fetching group', error);
    return error;
  }
};
