import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut, TwitterAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "process.env.APIKEY",
  authDomain: "process.env.AUTHDOMAIN",
  projectId: "process.env.PROJECTID",
  storageBucket: "process.env.STORAGEBUCKET",
  messagingSenderId: "process.env.MESSAGINGSENDERID",
  appId: "process.env.APPID",
  measurementId: "process.env.MESSAGINGSENDERID"
};


const app = initializeApp(firebaseConfig);
const TwitterLogin = () => {
  const [otp, setOtp] = useState(null);
  const [user, setUser] = useState(null);
  const [inputOtp, setInputOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleTwitterLogin = async () => {
    const auth = getAuth();
    const provider = new TwitterAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      console.log("Logged in user:", loggedInUser);
      setUser(loggedInUser);
      const generatedOtp = generateOtp();
      setOtp(generatedOtp);
      setIsOtpVerified(false);
      alert(`Please Verify OTP to login!`);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      alert("Twitter sign-in failed. Please try again.");
    }
  };

  const handleOtpInputChange = (e) => {
    setInputOtp(e.target.value);
  };

  const verifyOtp = () => {
    if (inputOtp === otp) {
      setIsOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      setOtp(null);
      setInputOtp("");
      setIsOtpVerified(false);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  useEffect(() => {
    if (isOtpVerified && user) {
      const timer = setTimeout(() => {
        window.open(`https://x.com/${user.displayName}`, '_blank');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOtpVerified, user]);

  return (

    <div style={styles.background}>
      <div style={styles.container}>
        <div>
          <h2>Test 4: Twitter API Integration</h2>
        </div>
        <h2 style={styles.header}>Twitter Login</h2>
        {!user && (
          <button style={styles.button} onClick={handleTwitterLogin}>
            Sign in with Twitter
          </button>
        )}

        {user && !isOtpVerified && (
          <div style={styles.otpContainer}>
            <h3 style={styles.otpHeader}>OTP: {otp}</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={inputOtp}
              onChange={handleOtpInputChange}
              style={styles.input}
            />
            <button style={styles.button} onClick={verifyOtp}>
              Verify OTP
            </button>
          </div>
        )}

        {user && isOtpVerified && (
          <div style={styles.welcomeContainer}>
            <h3 style={styles.welcomeHeader}>Welcome, {user.displayName}!</h3>
            <button style={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm1w3R6bQ3MEhm6aPEUeqhZQnwtmprparK4w&s')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(240, 248, 255, 0.8)',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  header: {
    color: '#1DA1F2',
  },
  button: {
    backgroundColor: '#1DA1F2',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  otpContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  otpHeader: {
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    margin: '10px 0',
    width: '100%',
  },
  welcomeContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  welcomeHeader: {
    color: '#333',
  },
};

export default TwitterLogin;