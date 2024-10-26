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
  SpeakerWaveIcon,
} from '@heroicons/react/24/solid';
import DotsAnimation from './DotsAnimation';
import RadialWaveAnimation from './RadialWaveAnimation';

const ExamTimerClock = ({ durationInMinutes = 60 }) => {
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
  const [animationIntensity, setAnimationIntensity] = useState(10); // 0-100 scale
  

  const originalDuration = useRef(durationInMinutes * 60);
  const intervalRef = useRef(null);
  const pausedTimeRef = useRef(null);
    
  // Animation control popup state
  const [showAnimationControls, setShowAnimationControls] = useState(false);
  const animationControlsRef = useRef(null);
  // Preset durations in minutes
  const presetDurations = [15, 30, 60, 90, 100, 120, 150, 180];

  const setPresetDuration = (minutes) => {
    if (isRunning || isPaused) {
      if (window.confirm("Changing duration will reset the timer. Continue?")) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(false);
        setTimeRemaining(minutes * 60);
        originalDuration.current = minutes * 60;
        pausedTimeRef.current = null;
      }
    } else {
      setTimeRemaining(minutes * 60);
      originalDuration.current = minutes * 60;
    }
  };

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
    const handleClickOutside = (event) => {
      if (
        animationControlsRef.current &&
        !animationControlsRef.current.contains(event.target)
      ) {
        setShowAnimationControls(false);
      }
    };
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black';
  }, [theme]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      
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
    <div className={`flex flex-col items-center justify-center h-screen transition-colors duration-1000 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {animationsEnabled && (
          <RadialWaveAnimation animationIntensity={animationIntensity}  />
        
      )}

      <div className="absolute top-4 right-4 cursor-pointer">
        {/* Previous icons */}
        <div onClick={toggleTheme}>
          {theme === 'light' ? (
            <MoonIcon className="w-8 h-8 text-gray-800 hover:text-gray-600" />
          ) : (
            <SunIcon className="w-8 h-8 text-yellow-400 hover:text-yellow-200" />
          )}
        </div>

        {/* Animation controls with popup */}
        <div className="relative mt-4">
          <div 
            onClick={() => setShowAnimationControls(!showAnimationControls)}
            // onMouseEnter={() => setShowAnimationControls(true)}
            className="relative"
          >
            {animationsEnabled ? (
              <PauseIcon className="w-8 h-8 text-red-500 hover:text-red-400" />
            ) : (
              <PlayIcon className="w-8 h-8 text-green-500 hover:text-green-400" />
            )}
          </div>

          {/* Animation Controls Popup */}
          {showAnimationControls && (
            <div 
            ref={animationControlsRef}
              className={`absolute right-10 top-0 p-4 rounded-lg shadow-lg z-50 w-64
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <SpeakerWaveIcon className="w-6 h-6" />
                <span className="ml-2">Animation Intensity</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={animationIntensity}
                  onChange={(e) => setAnimationIntensity(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer
                    ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-blue-500
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-blue-500
                    [&::-moz-range-thumb]:cursor-pointer`}
                />
                <span className="w-8 text-center">{animationIntensity}%</span>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  className={`px-3 py-1 rounded ${
                    animationsEnabled 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {animationsEnabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => setAnimationIntensity(50)}
                  className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rest of the icons */}
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

          {/* Preset Duration Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl px-4">
            {presetDurations.map((duration) => (
              <button
                key={duration}
                onClick={() => setPresetDuration(duration)}
                className={`px-4 py-2 rounded-lg text-white transition-colors
                  ${timeRemaining === duration * 60 
                    ? 'bg-blue-600 ring-2 ring-blue-400' 
                    : 'bg-blue-500 hover:bg-blue-600'
                  }
                  ${(isRunning || isPaused) ? 'opacity-50' : 'opacity-100'}
                `}
              >
                {duration} min
              </button>
            ))}
          </div>

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

          <div className="mt-8 flex flex-wrap justify-center gap-4">
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

      <a href="https://github.com/amessbee/timer" target="_blank" rel="noopener noreferrer" className="signature absolute bottom-4 right-6 text-4xl text-gray-700 z-20">
        ~ Mudassir Shabbir
      </a>
    </div>
  );
};

export default ExamTimerClock;