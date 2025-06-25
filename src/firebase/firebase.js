// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Verify that all required environment variables are set
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

// Debug log environment variables (don't log sensitive values in production)
if (import.meta.env.DEV) {
  console.log('Environment variables loaded:');
  requiredEnvVars.forEach(varName => {
    const value = import.meta.env[varName];
    // Only show first few characters of API key for security
    const displayValue = varName.includes('API_KEY') && value
      ? `${value.substring(0, 5)}...${value.substring(value.length - 4)}`
      : value;
    console.log(`- ${varName}: ${displayValue ? '✅ Set' : '❌ Missing'}`);
  });
}

// Validate required environment variables
let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth with settings
const auth = getAuth(app);
if (process.env.NODE_ENV === 'production') {
  auth.useDeviceLanguage();
}

// Initialize Firestore with settings
const db = getFirestore(app);

// Enable offline persistence in development
const initializePersistence = async () => {
  try {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      await enableIndexedDbPersistence(db, { 
        forceOwnership: true 
      });
      console.log('Firestore persistence enabled');
    }
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('Current browser does not support all required features for persistence.');
    } else if (err.code === 'failed-precondition') {
      console.warn('Persistence is already enabled in another tab.');
    } else {
      console.error('Error enabling Firestore persistence:', err);
    }
  }
};

// Initialize persistence only once
if (typeof window !== 'undefined') {
  initializePersistence();
}

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Configure auth settings
googleProvider.setCustomParameters({
  prompt: 'select_account'  // Forces account selection even when one account is available
});

// Function to sign in with Google
const signInWithGoogle = async (useRedirect = false) => {
  // Skip if not in browser environment
  if (typeof window === 'undefined') {
    console.error('Sign-in attempted in non-browser environment');
    return { 
      success: false, 
      error: { 
        code: 'auth/browser-required',
        message: 'Authentication requires a browser environment' 
      } 
    };
  }

  try {
    console.log('Initiating Google sign-in...');
    
    // In development, prefer popup for better debugging
    const shouldUseRedirect = process.env.NODE_ENV === 'production' || useRedirect;
    
    if (shouldUseRedirect) {
      console.log('Using redirect flow for Google sign-in');
      
      // Store the current URL to redirect back after sign-in
      const redirectPath = window.location.pathname + window.location.search;
      console.log('Storing redirect path:', redirectPath);
      sessionStorage.setItem('redirectAfterSignIn', redirectPath);
      
      try {
        console.log('Starting Google sign-in redirect...');
        await signInWithRedirect(auth, googleProvider);
        console.log('Sign-in redirect initiated');
        return { 
          success: true, 
          redirecting: true,
          message: 'Redirecting to Google sign-in...'
        };
      } catch (redirectError) {
        console.error('Google sign-in redirect failed:', redirectError);
        // Clean up on error
        sessionStorage.removeItem('redirectAfterSignIn');
        throw {
          code: redirectError.code || 'auth/redirect-failed',
          message: redirectError.message || 'Failed to initiate Google sign-in',
          details: redirectError
        };
      }
    } else {
      console.log('Using popup flow for Google sign-in');
      // Try popup first in development
      try {
        console.log('Opening Google sign-in popup...');
        result = await signInWithPopup(auth, googleProvider);
        console.log('Google sign-in popup completed successfully');
      } catch (popupError) {
        console.warn('Popup sign-in failed, falling back to redirect:', popupError);
        // If popup fails, fall back to redirect
        const redirectPath = window.location.pathname + window.location.search;
        console.log('Falling back to redirect with path:', redirectPath);
        sessionStorage.setItem('redirectAfterSignIn', redirectPath);
        
        try {
          await signInWithRedirect(auth, googleProvider);
          return { 
            success: true, 
            redirecting: true,
            message: 'Falling back to redirect flow...'
          };
        } catch (fallbackError) {
          console.error('Fallback redirect also failed:', fallbackError);
          sessionStorage.removeItem('redirectAfterSignIn');
          throw {
            code: fallbackError.code || 'auth/sign-in-failed',
            message: 'Both popup and redirect sign-in methods failed',
            details: {
              popupError: popupError,
              redirectError: fallbackError
            }
          };
        }
      }
    }
    
    // Process successful popup sign-in
    if (result) {
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // If user doesn't exist, create a new document
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      return { success: true, user };
    }
    
    return { success: false, error: new Error('No authentication result') };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { 
      success: false, 
      error,
      message: error.message || 'Failed to sign in with Google'
    };
  }
};

// Track if we've already handled the redirect
let redirectHandled = false;

// Handle redirect result after authentication
export const handleRedirectResult = async () => {
  // Skip if we're not in a browser environment
  if (typeof window === 'undefined') {
    return { success: false, isNotRedirect: true };
  }

  try {
    // Check if we have a redirect URL stored
    const redirectUrl = sessionStorage.getItem('redirectAfterSignIn');
    
    // If no redirect URL is stored, this is not part of our auth flow
    if (!redirectUrl) {
      return { success: false, isNotRedirect: true };
    }

    console.log('Attempting to handle redirect result...');
    
    // Check if we're coming back from a redirect
    const result = await getRedirectResult(auth);
    
    // If no result, this is not a redirect from auth
    if (!result) {
      console.log('No authentication result - not a redirect from auth');
      return { success: false, isNotRedirect: true };
    }

    const { user } = result;
    if (!user) {
      console.error('No user data in authentication result');
      throw new Error('No user data available');
    }

    console.log('User authenticated:', user.uid);
    
    try {
      // Ensure we have the latest token
      const token = await user.getIdToken(true);
      console.log('Retrieved user token');
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      // Prepare user data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || null,
        lastLogin: new Date(),
        updatedAt: new Date(),
        ...(userDoc.exists() ? {} : { 
          createdAt: new Date(),
          provider: user.providerData?.[0]?.providerId || 'unknown'
        })
      };
      
      // Update or create user document
      console.log('Updating user document in Firestore...');
      await setDoc(userRef, userData, { merge: true });
      console.log('User document updated successfully');
      
      // Clean up
      sessionStorage.removeItem('redirectAfterSignIn');
      
      // Store minimal auth state
      localStorage.setItem('authToken', token);
      
      return { 
        success: true, 
        redirectUrl,
        user: userData
      };
      
    } catch (dbError) {
      console.error('Error updating user data:', dbError);
      // Even if Firestore update fails, we can still proceed with login
      // since the user is already authenticated
      return {
        success: true,
        redirectUrl,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || null
        }
      };
    }
    
  } catch (error) {
    console.error("Error handling redirect result:", error);
    // Clean up any partial state
    sessionStorage.removeItem('redirectAfterSignIn');
    
    return { 
      success: false, 
      error: {
        message: error.message || 'Authentication failed',
        code: error.code || 'auth/unknown-error',
        details: error
      },
      isNotRedirect: false
    };
  }
};

// Function to sign in with GitHub
const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    // If user doesn't exist, create a new document
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return { success: true, user };
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    return { success: false, error };
  }
};

// Email link authentication
const sendSignInLink = async (email) => {
  const actionCodeSettings = {
    // URL you want to redirect back to after email verification
    url: `${window.location.origin}/verify-email`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Save the email locally to use after clicking the link
    window.localStorage.setItem('emailForSignIn', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending sign in link:', error);
    return { success: false, error };
  }
};

// Check if the current URL is a sign-in link
const isSignInLinkUrl = () => {
  return isSignInWithEmailLink(auth, window.location.href);
};

// Complete the sign in with email link
const signInWithEmail = async (email) => {
  try {
    let emailForSignIn = email || window.localStorage.getItem('emailForSignIn');
    
    if (!emailForSignIn) {
      emailForSignIn = window.prompt('Please provide your email for confirmation');
    }
    
    const result = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
    
    // Clear the email from storage
    window.localStorage.removeItem('emailForSignIn');
    
    // Update the user's email verification status
    await result.user.reload();
    
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error signing in with email link:', error);
    return { success: false, error };
  }
};

// Sign out function
const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

export { 
  app, 
  analytics, 
  auth, 
  db, 
  googleProvider,
  githubProvider, 
  signInWithGoogle,
  signInWithGitHub,
  GoogleAuthProvider,
  sendSignInLink,
  isSignInLinkUrl,
  signInWithEmail,
  signOut,
  onAuthStateChanged
};
