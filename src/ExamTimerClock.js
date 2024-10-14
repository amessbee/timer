import React, { useState, useEffect } from 'react';

const ExamTimerClock = ({ durationInMinutes }) => {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Exam Timer</h1>
      <div className="text-6xl font-mono bg-white p-8 rounded-lg shadow-lg">
        {formatTime(timeRemaining)}
      </div>
      {timeRemaining === 0 && (
        <p className="mt-4 text-2xl font-bold text-red-600">Time's up!</p>
      )}
    </div>
  );
};

export default ExamTimerClock;