import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid) => {
    if (!uid) return null;
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setUserData(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return null;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await fetchUserData(userCredential.user.uid);
    }
    return userCredential;
  };

  const registerCustomer = async ({ email, password, name, phone }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Send verification email
    try {
      await sendEmailVerification(user);
    } catch (err) {
      console.warn('Could not send initial verification email:', err);
    }

    // Save to Firestore users collection with 'customer' role
    const customerProfile = {
      uid: user.uid,
      email: user.email,
      displayName: name || '',
      phone: phone || '',
      role: 'customer',
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), customerProfile);
    setUserData(customerProfile);
    return userCredential;
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const triggerVerificationEmail = async () => {
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser);
    }
    throw new Error('No active user logged in.');
  };

  const updateUserProfileData = async (updates) => {
    if (!currentUser) throw new Error('No active user logged in.');

    // Update Firebase Auth profile if displayName changed
    if (updates.displayName && updates.displayName !== currentUser.displayName) {
      await updateProfile(currentUser, { displayName: updates.displayName });
    }

    // Update Firestore user document
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    await fetchUserData(currentUser.uid);
  };

  const logout = () => {
    setUserData(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    role: userData?.role || 'customer',
    isAdmin: userData?.role === 'admin',
    isCustomer: userData?.role === 'customer' || !userData?.role,
    fetchUserData: () => currentUser ? fetchUserData(currentUser.uid) : Promise.resolve(null),
    login,
    registerCustomer,
    resetPassword,
    triggerVerificationEmail,
    updateUserProfileData,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
