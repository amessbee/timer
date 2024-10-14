import React from 'react';
   import ExamTimerClock from './ExamTimerClock';

   function App() {
     return (
       <div className="App">
         <ExamTimerClock durationInMinutes={90} /> {/* 2-hour exam */}
       </div>
     );
   }

   export default App;