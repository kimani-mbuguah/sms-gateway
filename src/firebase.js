import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
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

const storage = firebase.storage();

export { storage, firebase as default };

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

String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

export const generateUserDocument = async (values, imageUrl, uid) => {
  // (!values || uid) return;
  const formattedPhone = values.phone.replace(/^.{1}/g, '+254');
  const usersRef = firestore
    .doc(`apps/${uid}`)
    .collection(`users`)
    .doc(formattedPhone);
  const snapshot = await usersRef.get();

  if (!snapshot.exists) {
    await usersRef
      .set({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: formattedPhone,
        gender: values.gender,
        ageBracket: values.age,
        career: values.career,
        bornAgain: values.bornAgain,
        baptised: values.baptised,
        ministry: values.ministry,
        lifeGroup: values.lifeGroup,
        residence: values.residence,
        plugin: values.plugin,
        children: values.children,
        photo: imageUrl
      })
      .then(success => {
        if (values.children === 'yes') {
          console.log('children');
        } else {
          console.log('no children');
          return getUserDocument(uid, values.phone);
        }
      })
      .catch(error => {
        return error;
      });
  } else {
    console.log('phone already taken');
    return 'Phone number already taken. Please use a different phone number';
  }
};

const makeId = length => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateChildrenDocument = async (values, phone, uid) => {
  if (
    values.firstName1 &&
    !values.firstName2 &&
    !values.firstName3 &&
    !values.firstName4 &&
    !values.firstName5 &&
    !values.firstName6
  ) {
    const childrenRef = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    await childrenRef
      .set({
        name: `${values.firstName1} ${values.lastName1}`,
        gender: values.gender1,
        age: values.age1
      })
      .then(success => {
        return success;
      })
      .catch(error => {
        return error;
      });
  } else if (
    values.firstName1 &&
    values.firstName2 &&
    !values.firstName3 &&
    !values.firstName4 &&
    !values.firstName5 &&
    !values.firstName6
  ) {
    const childrenRef1 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef2 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const name1 = `${values.firstName1} ${values.lastName1}`;
    const gender1 = `${values.gender1}`;
    const age1 = `${values.age1}`;

    const name2 = `${values.firstName2} ${values.lastName2}`;
    const gender2 = `${values.gender2}`;
    const age2 = `${values.age2}`;

    await childrenRef1.set({
      name: name1,
      gender: gender1,
      age: age1
    });

    await childrenRef2.set({
      name: name2,
      gender: gender2,
      age: age2
    });

    return 'done';
  } else if (
    values.firstName1 &&
    values.firstName2 &&
    values.firstName3 &&
    !values.firstName4 &&
    !values.firstName5 &&
    !values.firstName6
  ) {
    const childrenRef1 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef2 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef3 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const name1 = `${values.firstName1} ${values.lastName1}`;
    const gender1 = `${values.gender1}`;
    const age1 = `${values.age1}`;

    const name2 = `${values.firstName2} ${values.lastName2}`;
    const gender2 = `${values.gender2}`;
    const age2 = `${values.age2}`;

    const name3 = `${values.firstName3} ${values.lastName3}`;
    const gender3 = `${values.gender3}`;
    const age3 = `${values.age3}`;

    await childrenRef1.set({
      name: name1,
      gender: gender1,
      age: age1
    });

    await childrenRef2.set({
      name: name2,
      gender: gender2,
      age: age2
    });

    await childrenRef3.set({
      name: name3,
      gender: gender3,
      age: age3
    });

    return 'done';
  } else if (
    values.firstName1 &&
    values.firstName2 &&
    values.firstName3 &&
    values.firstName4 &&
    !values.firstName5 &&
    !values.firstName6
  ) {
    const childrenRef1 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef2 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef3 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef4 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const name1 = `${values.firstName1} ${values.lastName1}`;
    const gender1 = `${values.gender1}`;
    const age1 = `${values.age1}`;

    const name2 = `${values.firstName2} ${values.lastName2}`;
    const gender2 = `${values.gender2}`;
    const age2 = `${values.age2}`;

    const name3 = `${values.firstName3} ${values.lastName3}`;
    const gender3 = `${values.gender3}`;
    const age3 = `${values.age3}`;

    const name4 = `${values.firstName4} ${values.lastName4}`;
    const gender4 = `${values.gender4}`;
    const age4 = `${values.age4}`;

    await childrenRef1.set({
      name: name1,
      gender: gender1,
      age: age1
    });

    await childrenRef2.set({
      name: name2,
      gender: gender2,
      age: age2
    });

    await childrenRef3.set({
      name: name3,
      gender: gender3,
      age: age3
    });

    await childrenRef4.set({
      name: name4,
      gender: gender4,
      age: age4
    });

    return 'done';
  } else if (
    values.firstName1 &&
    values.firstName2 &&
    values.firstName3 &&
    values.firstName4 &&
    values.firstName5 &&
    !values.firstName6
  ) {
    const childrenRef1 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef2 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef3 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef4 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef5 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const name1 = `${values.firstName1} ${values.lastName1}`;
    const gender1 = `${values.gender1}`;
    const age1 = `${values.age1}`;

    const name2 = `${values.firstName2} ${values.lastName2}`;
    const gender2 = `${values.gender2}`;
    const age2 = `${values.age2}`;

    const name3 = `${values.firstName3} ${values.lastName3}`;
    const gender3 = `${values.gender3}`;
    const age3 = `${values.age3}`;

    const name4 = `${values.firstName4} ${values.lastName4}`;
    const gender4 = `${values.gender4}`;
    const age4 = `${values.age4}`;

    const name5 = `${values.firstName5} ${values.lastName5}`;
    const gender5 = `${values.gender5}`;
    const age5 = `${values.age5}`;

    await childrenRef1.set({
      name: name1,
      gender: gender1,
      age: age1
    });

    await childrenRef2.set({
      name: name2,
      gender: gender2,
      age: age2
    });

    await childrenRef3.set({
      name: name3,
      gender: gender3,
      age: age3
    });

    await childrenRef4.set({
      name: name4,
      gender: gender4,
      age: age4
    });

    await childrenRef5.set({
      name: name5,
      gender: gender5,
      age: age5
    });

    return 'done';
  } else if (
    values.firstName1 &&
    values.firstName2 &&
    values.firstName3 &&
    values.firstName4 &&
    values.firstName5 &&
    values.firstName6
  ) {
    const name1 = `${values.firstName1} ${values.lastName1}`;
    const gender1 = `${values.gender1}`;
    const age1 = `${values.age1}`;

    const name2 = `${values.firstName2} ${values.lastName2}`;
    const gender2 = `${values.gender2}`;
    const age2 = `${values.age2}`;

    const name3 = `${values.firstName3} ${values.lastName3}`;
    const gender3 = `${values.gender3}`;
    const age3 = `${values.age3}`;

    const name4 = `${values.firstName4} ${values.lastName4}`;
    const gender4 = `${values.gender4}`;
    const age4 = `${values.age4}`;

    const name5 = `${values.firstName5} ${values.lastName5}`;
    const gender5 = `${values.gender5}`;
    const age5 = `${values.age5}`;

    const name6 = `${values.firstName6} ${values.lastName6}`;
    const gender6 = `${values.gender6}`;
    const age6 = `${values.age6}`;

    const childrenRef1 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef2 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef3 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef4 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef5 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    const childrenRef6 = firestore
      .doc(`apps/${uid}`)
      .collection(`users`)
      .doc(phone)
      .collection('children ')
      .doc(makeId(10));

    await childrenRef1.set({
      name: name1,
      gender: gender1,
      age: age1
    });

    await childrenRef2.set({
      name: name2,
      gender: gender2,
      age: age2
    });

    await childrenRef3.set({
      name: name3,
      gender: gender3,
      age: age3
    });

    await childrenRef4.set({
      name: name4,
      gender: gender4,
      age: age4
    });

    await childrenRef5.set({
      name: name5,
      gender: gender5,
      age: age5
    });

    await childrenRef6.set({
      name: name6,
      gender: gender6,
      age: age6
    });

    return 'done';
  } else {
    return 'Invalid data supplied';
  }
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
    return error;
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
