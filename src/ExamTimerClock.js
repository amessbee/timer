import React, { useState, useEffect, useRef } from 'react';
import {
  SunIcon,
  MoonIcon,
  PlayIcon,
  PauseIcon,
  PlusCircleIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';
import DotsAnimation from './DotsAnimation';
import RadialWaveAnimation from './RadialWaveAnimation';

const ExamTimerClock = ({ durationInMinutes }) => {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [heading, setHeading] = useState("Exam Timer");
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const originalDuration = useRef(durationInMinutes * 60);
  const intervalRef = useRef(null);
  const pausedTimeRef = useRef(null);

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
      if (isRunning) {
        pausedTimeRef.current = Date.now() + ((timeRemaining + 5 * 60) * 1000);
      }
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const toggleVisibility = () => {
    setIsHidden((prev) => !prev);
  };

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black';
  }, [theme]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      
      // If resuming from pause, use the remaining time
      // Otherwise, start fresh
      const endTime = isPaused 
        ? Date.now() + (timeRemaining * 1000)
        : Date.now() + (timeRemaining * 1000);
      
      pausedTimeRef.current = endTime;

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((pausedTimeRef.current - now) / 1000));
        
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsPaused(false);
          setTimeRemaining(0);
        }
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setIsPaused(true);
      // Store the current remaining time
      const remaining = Math.max(0, Math.floor((pausedTimeRef.current - Date.now()) / 1000));
      setTimeRemaining(remaining);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(originalDuration.current);
    pausedTimeRef.current = null;
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(originalDuration.current);
    pausedTimeRef.current = null;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {animationsEnabled && <RadialWaveAnimation />}

      <div className="absolute top-4 right-4 cursor-pointer">
        <div onClick={toggleTheme}>
          {theme === 'light' ? (
            <MoonIcon className="w-8 h-8 text-gray-800 hover:text-gray-600" />
          ) : (
            <SunIcon className="w-8 h-8 text-yellow-400 hover:text-yellow-200" />
          )}
        </div>

        <div onClick={toggleAnimations} className="mt-4">
          {animationsEnabled ? (
            <PauseIcon className="w-8 h-8 text-red-500 hover:text-red-400" />
          ) : (
            <PlayIcon className="w-8 h-8 text-green-500 hover:text-green-400" />
          )}
        </div>

        <div onClick={addFiveMinutes} className="mt-4">
          <PlusCircleIcon className="w-8 h-8 text-blue-500 hover:text-blue-400" />
        </div>

        <div onClick={toggleFullScreen} className="mt-4">
          {isFullScreen ? (
            <ArrowsPointingInIcon className={`w-8 h-8 cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:text-gray-400' : 'text-gray-800 hover:text-gray-600'}`} />
          ) : (
            <ArrowsPointingOutIcon className={`w-8 h-8 cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:text-gray-400' : 'text-gray-800 hover:text-gray-600'}`} />
          )}
        </div>

        <div onClick={toggleVisibility} className="mt-4">
          {isHidden ? (
            <EyeSlashIcon className="w-8 h-8 text-red-500 hover:text-red-400 cursor-pointer" />
          ) : (
            <EyeIcon className="w-8 h-8 text-green-500 hover:text-green-400 cursor-pointer" />
          )}
        </div>
      </div>

      {!isHidden && (
        <>
          {isEditingHeading ? (
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              onBlur={() => setIsEditingHeading(false)}
              autoFocus
              className="text-5xl font-bold mb-8 bg-transparent outline-none text-center"
            />
          ) : (
            <h1
              className="text-5xl font-bold mb-8 cursor-pointer"
              onDoubleClick={() => setIsEditingHeading(true)}
            >
              {heading}
            </h1>
          )}

          {isEditingTime ? (
            <input
              type="text"
              value={formatTime(timeRemaining)}
              onChange={(e) => {
                // Add time input validation here if needed
                setTimeRemaining(e.target.value);
              }}
              onBlur={() => setIsEditingTime(false)}
              autoFocus
              className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-mono p-8 rounded-lg shadow-lg bg-transparent outline-none text-center"
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
              disabled={isRunning}
              className={`px-6 py-3 text-white rounded-lg shadow ${
                isRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isPaused ? 'Resume' : 'Start'}
            </button>
            <button
              onClick={pauseTimer}
              disabled={!isRunning}
              className={`px-6 py-3 text-white rounded-lg shadow ${
                !isRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              Pause
            </button>
            <button
              onClick={stopTimer}
              disabled={!isRunning && !isPaused}
              className={`px-6 py-3 text-white rounded-lg shadow ${
                (!isRunning && !isPaused) ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
              }`}
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
        </>
      )}

      <div className="signature absolute bottom-4 right-6 text-4xl text-gray-700 z-20">
        ~ Mudassir Shabbir
      </div>
    </div>
  );
};

export default ExamTimerClock;