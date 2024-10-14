import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DotsAnimation from './DotsAnimation';
import RadialWaveAnimation from './RadialWaveAnimation';

const RandomAnimation = () => (
  <motion.div
    className="absolute bg-pink-500 w-6 h-6 rounded-full"
    animate={{
      x: [0, 100, -100, 0],
      y: [0, -50, 50, 0],
      opacity: [1, 0.5, 1],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Random SVG animation component
const RandomSVGAnimation = () => {
    const randomValues = Array.from({ length: 5 }, () => ({
      cx: Math.random() * 100 + '%',  // Random horizontal position
      cy: Math.random() * 100 + '%',  // Random vertical position
      r: Math.random() * 5 + 5,       // Random radius size
    }));
  
    return (
      <svg height="100vh" width="100vw" className="absolute top-0 left-0 pointer-events-none">
        {randomValues.map((value, index) => (
          <circle
            key={index}
            cx={value.cx}
            cy={value.cy}
            r={value.r}
            fill="rgba(255, 255, 255, 0.5)"
            className="animate-pulse"
          />
        ))}
      </svg>
    );
  };

const ExamTimerClock = ({ durationInMinutes }) => {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dots, setDots] = useState([]);
  
  const [theme, setTheme] = useState(() => {
    // Load the saved theme from localStorage or default to light theme
    return localStorage.getItem('theme') || 'light';
  });

  const originalDuration = useRef(durationInMinutes * 60);
  const intervalRef = useRef(null);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply the selected theme to the body class
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black';
  }, [theme]);

  // Start timer
  const startTimer = () => {
    if (!isRunning || isPaused) {
      setIsRunning(true);
      setIsPaused(false);
      const endTime = Date.now() + timeRemaining * 1000;

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setTimeRemaining(0);
        }
      }, 1000);
    }
  };

  // Pause timer
  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsPaused(true);
      setIsRunning(false);
    }
  };

  // Stop timer (reset to original time)
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(originalDuration.current);
  };

  // Reset timer to original duration
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(originalDuration.current);
  };

  // Format the time to HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    
    <div className={`flex flex-col items-center justify-center h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
       {/* Insert Random SVG Animation */}
       {/* <RandomSVGAnimation /> */}
      {/* Theme toggle button */}
      {/* <RandomAnimation /> */}
      {/* Insert Canvas Animation */}
      {/* <DotsAnimation /> */}
      <RadialWaveAnimation />

      <button 
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700">
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </button>

      <h1 className="text-5xl font-bold mb-8">Exam Timer</h1>
      <div className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-mono ${theme === 'dark' ? 'bg-gray-100 text-white' : 'bg-gray-100 text-black'} p-8 rounded-lg shadow-lg">
        {formatTime(timeRemaining)}
      </div>
      {timeRemaining === 0 && (
        <p className="mt-8 text-4xl font-bold text-red-600">Time's up!</p>
      )}
      
      {/* Buttons for controlling the timer */}
      <div className="mt-8 flex space-x-4">
        <button 
          onClick={startTimer}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
          Start
        </button>
        <button 
          onClick={pauseTimer}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600">
          Pause
        </button>
        <button 
          onClick={stopTimer}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
          Stop
        </button>
        <button 
          onClick={resetTimer}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Reset
        </button>
      </div>
      {/* Signature */}
      <div className="signature absolute bottom-4 right-6 text-4xl text-gray-700 z-20">
        ~ Mudassir Shabbir
      </div>
    </div>
  );
};

export default ExamTimerClock;
