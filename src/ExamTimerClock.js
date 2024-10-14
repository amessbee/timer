import React, { useState, useEffect } from 'react';

const ExamTimerClock = ({ durationInMinutes }) => {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const storedTime = localStorage.getItem('examTimeRemaining');
    if (storedTime) {
      const endTime = parseInt(storedTime, 10);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      return remaining;
    }
    return durationInMinutes * 60;
  });

  useEffect(() => {
    const endTime = Date.now() + timeRemaining * 1000;
    localStorage.setItem('examTimeRemaining', endTime.toString());

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        localStorage.removeItem('examTimeRemaining');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-8">Exam Timer</h1>
      <div className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-mono bg-white p-8 rounded-lg shadow-lg">
        {formatTime(timeRemaining)}
      </div>
      {timeRemaining === 0 && (
        <p className="mt-8 text-4xl font-bold text-red-600">Time's up!</p>
      )}
    </div>
  );
};

export default ExamTimerClock;