// Import the necessary Firebase functions and React hooks
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { useState, useEffect } from "react";
import { firebaseConfig } from "./secrets"; // Ensure this file exports your Firebase config

const VisitorCounter = () => {
  const [count, setCount] = useState(0); // State to hold the visitor count
  const [error, setError] = useState(null); // State to hold any error messages

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const visitsRef = ref(db, "visits");

    // Function to increment the visitor count using a transaction
    const incrementVisitor = async () => {
      try {
        await runTransaction(visitsRef, (currentCount) => {
          return (currentCount || 0) + 1;
        });
        // Mark that the user has visited in this session to prevent multiple counts
        sessionStorage.setItem('hasVisited', 'true');
      } catch (err) {
        console.error("Transaction failed: ", err);
        setError("Failed to increment visitor count.");
      }
    };

    // Check if the user has already been counted in this session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      incrementVisitor();
    }

    // Listen for changes to the visitor count and update the state accordingly
    const unsubscribe = onValue(visitsRef, (snapshot) => {
      const data = snapshot.val() || 0;
      setCount(data);
    }, (error) => {
      console.error("Error fetching visits: ", error);
      setError("Failed to fetch visitor count.");
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return <div className="text-sm text-gray-500 absolute left-[-9999px] mt-2">{count}</div>;
};

export default VisitorCounter;
