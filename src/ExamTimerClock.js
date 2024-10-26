import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, PlayIcon, PauseIcon, PlusCircleIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid'; // Import the new icon
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

const RandomSVGAnimation = () => {
  const randomValues = Array.from({ length: 5 }, () => ({
    cx: Math.random() * 100 + '%',
    cy: Math.random() * 100 + '%',
    r: Math.random() * 5 + 5,
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
  const [heading, setHeading] = useState("Exam Timer");
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [animationsEnabled, setAnimationsEnabled] = useState(true); // State for controlling animations

  const originalDuration = useRef(durationInMinutes * 60);
  const intervalRef = useRef(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleAnimations = () => {
    setAnimationsEnabled((prev) => !prev);
  };

  const addFiveMinutes = () => {
    if (window.confirm("Do you want to add 5 minutes to the timer?")) {
      setTimeRemaining((prevTime) => prevTime + 5 * 60);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black';
  }, [theme]);

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

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsPaused(true);
      setIsRunning(false);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(originalDuration.current);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(originalDuration.current);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {animationsEnabled && <RadialWaveAnimation />} {/* Conditional rendering based on animations state */}

      {/* Theme toggle icon */}
      <div className="absolute top-4 right-4 cursor-pointer">
        <div onClick={toggleTheme}>
          {theme === 'light' ? (
            <MoonIcon className="w-8 h-8 text-gray-800 hover:text-gray-600" />
          ) : (
            <SunIcon className="w-8 h-8 text-yellow-400 hover:text-yellow-200" />
          )}
        </div>

        {/* Animation toggle icon */}
        <div onClick={toggleAnimations} className="mt-4">
          {animationsEnabled ? (
            <PauseIcon className="w-8 h-8 text-red-500 hover:text-red-400" />
          ) : (
            <PlayIcon className="w-8 h-8 text-green-500 hover:text-green-400" />
          )}
        </div>

        {/* Add 5 minutes icon */}
        <div onClick={addFiveMinutes} className="mt-4">
          <PlusCircleIcon className="w-8 h-8 text-blue-500 hover:text-blue-400" />
        </div>

        {/* Full-screen toggle icon */}
        <div onClick={toggleFullScreen} className="mt-4">
          <ArrowsPointingOutIcon className="w-8 h-8 text-gray-800 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Editable Heading */}
      {isEditingHeading ? (
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          onBlur={() => setIsEditingHeading(false)}
          autoFocus
          className="text-5xl font-bold mb-8 bg-transparent outline-none"
        />
      ) : (
        <h1
          className="text-5xl font-bold mb-8 cursor-pointer"
          onDoubleClick={() => setIsEditingHeading(true)}
        >
          {heading}
        </h1>
      )}

      {/* Editable Timer */}
      {isEditingTime ? (
        <input
          type="text"
          value={formatTime(timeRemaining)}
          onChange={(e) => setTimeRemaining(e.target.value)}
          onBlur={() => setIsEditingTime(false)}
          autoFocus
          className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-mono p-8 rounded-lg shadow-lg bg-transparent outline-none"
        />
      ) : (
        <div
          className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-mono p-8 rounded-lg shadow-lg cursor-pointer"
          onDoubleClick={() => setIsEditingTime(true)}
        >
          {formatTime(timeRemaining)}
        </div>
      )}

      {timeRemaining === 0 && (
        <p className="mt-8 text-4xl font-bold text-red-600">Time's up!</p>
      )}

      <div className="mt-8 flex space-x-4">
        <button
          onClick={startTimer}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
        >
          Start
        </button>
        <button
          onClick={pauseTimer}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
        >
          Pause
        </button>
        <button
          onClick={stopTimer}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Stop
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Reset
        </button>
      </div>

      <div className="signature absolute bottom-4 right-6 text-4xl text-gray-700 z-20">
        ~ Mudassir Shabbir
      </div>
    </div>
  );
};

export default ExamTimerClock;
