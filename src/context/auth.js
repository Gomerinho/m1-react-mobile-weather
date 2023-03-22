import React, {createContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/firestore';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);

      if (u?.uid) {
        const fetchedUser = firebase.firestore().collection('users').doc(u.uid);

        fetchedUser.get().then(doc => {
          if (doc.exists) {
            setUser(prevState => ({
              ...prevState,
              favorites: doc.data().favorites,
            }));
          } else {
            console.log('No such document!');
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
