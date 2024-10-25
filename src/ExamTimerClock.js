import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, PlayIcon, PauseIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DotsAnimation from './DotsAnimation';
import RadialWaveAnimation from './RadialWaveAnimation';

const ExamTimerClock = ({ durationInMinutes }) => {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [heading, setHeading] = useState("Exam Timer");
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showTimeInputDialog, setShowTimeInputDialog] = useState(false);
  const [inputTime, setInputTime] = useState({ hours: '00', minutes: '00', seconds: '00' });

  const originalDuration = useRef(durationInMinutes * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Update input time when timeRemaining changes
    const hours = Math.floor(timeRemaining / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timeRemaining % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    setInputTime({ hours, minutes, seconds });
  }, [timeRemaining]);

  const handleTimeInputChange = (unit, value) => {
    // Remove non-numeric characters and limit to 2 digits
    const cleanValue = value.replace(/\D/g, '').slice(0, 2);
    setInputTime(prev => ({ ...prev, [unit]: cleanValue.padStart(2, '0') }));
  };

  const handleStartTimer = () => {
    setShowTimeInputDialog(true);
  };

  const startTimerWithInputTime = () => {
    const totalSeconds = 
      parseInt(inputTime.hours || '0') * 3600 + 
      parseInt(inputTime.minutes || '0') * 60 + 
      parseInt(inputTime.seconds || '0');
    
    setTimeRemaining(totalSeconds);
    setShowTimeInputDialog(false);
    
    if (!isRunning || isPaused) {
      setIsRunning(true);
      setIsPaused(false);
      const endTime = Date.now() + totalSeconds * 1000;

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

  const getTimeUnits = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    return { hours, minutes, seconds };
  };

  const handleTimeUnitChange = (unit, value) => {
    const timeUnits = getTimeUnits();
    let newValue = parseInt(value) || 0;

    // Enforce limits for each unit
    if (unit === 'hours') {
      newValue = Math.min(99, Math.max(0, newValue));
    } else {
      newValue = Math.min(59, Math.max(0, newValue));
    }

    const newTimeUnits = { ...timeUnits, [unit]: newValue };
    const newTotalSeconds = 
      newTimeUnits.hours * 3600 + 
      newTimeUnits.minutes * 60 + 
      newTimeUnits.seconds;
    
    setTimeRemaining(newTotalSeconds);
  };

  const TimeUnit = ({ unit, value, isEditing, onStartEdit, onEndEdit }) => {
    const [localValue, setLocalValue] = useState(value.toString().padStart(2, '0'));

    useEffect(() => {
      setLocalValue(value.toString().padStart(2, '0'));
    }, [value]);

    if (isEditing) {
      return (
        <input
          type="text"
          value={localValue}
          onChange={(e) => {
            const newValue = e.target.value.slice(-2);
            setLocalValue(newValue);
            handleTimeUnitChange(unit, newValue);
          }}
          onBlur={() => onEndEdit()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEndEdit();
            if (e.key === 'Tab') e.preventDefault();
          }}
          className={`
            w-[1.1em] 
            text-center 
            bg-transparent 
            border-b-2 
            border-current 
            outline-none 
            font-mono 
            text-[8rem] 
            sm:text-[10rem] 
            md:text-[12rem]
            p-0
            m-0
            focus:outline-none
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          `}
          maxLength={2}
          autoFocus
        />
      );
    }

    return (
      <span
        className="inline-block min-w-[1.1em] text-center cursor-pointer hover:text-blue-500 transition-colors duration-200"
        onDoubleClick={() => onStartEdit()}
      >
        {value.toString().padStart(2, '0')}
      </span>
    );
  };

  const { hours, minutes, seconds } = getTimeUnits();

  return (
    <div className={`flex flex-col items-center justify-center h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* ... (previous UI elements remain the same until the buttons section) */}

      <div className="mt-8 flex space-x-4">
        <button
          onClick={handleStartTimer}
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

      <Dialog open={showTimeInputDialog} onOpenChange={setShowTimeInputDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Timer Duration</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium mb-2">Hours</label>
              <Input
                type="text"
                value={inputTime.hours}
                onChange={(e) => handleTimeInputChange('hours', e.target.value)}
                className="text-center text-lg"
                maxLength={2}
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium mb-2">Minutes</label>
              <Input
                type="text"
                value={inputTime.minutes}
                onChange={(e) => handleTimeInputChange('minutes', e.target.value)}
                className="text-center text-lg"
                maxLength={2}
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium mb-2">Seconds</label>
              <Input
                type="text"
                value={inputTime.seconds}
                onChange={(e) => handleTimeInputChange('seconds', e.target.value)}
                className="text-center text-lg"
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTimeInputDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={startTimerWithInputTime} className="bg-green-500 hover:bg-green-600">
              Start Timer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="signature absolute bottom-4 right-6 text-4xl text-gray-700 z-20">
        ~ Mudassir Shabbir
      </div>
    </div>
  );
};

export default ExamTimerClock;