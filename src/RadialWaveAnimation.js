import React, { useEffect, useRef } from 'react';

const ComplexWaveAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const waves = [];

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // List of 10 complex geometric functions
    const geometricFunctions = [
      (wave) => { wave.x += wave.speed; wave.y += Math.sin(wave.x * 0.05) * 10; },   // Sine wave
      (wave) => { wave.angle += wave.speed * 0.05; wave.x = canvas.width / 2 + wave.radius * Math.cos(wave.angle); wave.y = canvas.height / 2 + wave.radius * Math.sin(wave.angle); wave.radius += wave.growthRate; },  // Spiral
      (wave) => { wave.x += wave.speed; wave.y += Math.cos(wave.x * 0.03) * 20; },   // Cosine wave
      (wave) => { wave.x += Math.cos(wave.angle) * wave.speed; wave.y += Math.sin(wave.angle) * wave.speed; wave.angle += 0.05; },  // Circle motion
      (wave) => { wave.x += wave.speed; wave.y += Math.tan(wave.x * 0.02) * 5; },   // Tangent wave
      (wave) => { wave.x = wave.x + Math.cos(wave.angle) * wave.radius; wave.y = wave.y + Math.sin(wave.angle) * wave.radius; wave.angle += wave.growthRate; }, // Elliptical motion
      (wave) => { wave.x += wave.speed; wave.y += (Math.pow(wave.x * 0.05, 2) * 0.5) - 50; },  // Parabolic curve
      (wave) => { wave.x += Math.sin(wave.angle) * wave.speed; wave.y += Math.cos(wave.angle) * wave.speed; wave.angle += wave.growthRate; },  // Hypotrochoid (circular path within a circle)
      (wave) => { wave.x += wave.speed; wave.y += Math.abs(Math.sin(wave.x * 0.02) * 50); },  // Abs(sine) wave (bounces)
      (wave) => { wave.x += wave.speed; wave.y = 300 + Math.sin(wave.angle) * wave.radius; wave.angle += 0.03; wave.radius += wave.growthRate; },  // Vertical sine waves
    ];

    // Geometric Wave class for various complex functions
    class GeometricWave {
      constructor() {
        this.x = Math.random() * canvas.width;  // Starting X position
        this.y = Math.random() * canvas.height;  // Starting Y position
        this.angle = 0;  // Initial angle for circular and parametric motions
        this.radius = Math.random() * 50 + 1;  // Initial radius
        this.growthRate = Math.random() * 0.02 + 0.01;  // Growth rate for circular paths
        this.speed = Math.random() * 2 + 1;  // Speed of movement
        this.opacity = 1;  // Initial opacity
        this.fadeRate = 0.005;  // Fade out rate
        this.animationFunc = geometricFunctions[Math.floor(Math.random() * geometricFunctions.length)];  // Randomly select a geometric function
      }

      // Update position and properties based on the chosen geometric function
      update() {
        this.animationFunc(this);  // Call the randomly assigned geometric function
        this.opacity -= this.fadeRate;  // Fade out gradually
      }

      // Draw the geometric wave
      draw() {
        if (this.opacity > 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // Create geometric waves
    function createWaves() {
      waves.push(new GeometricWave());
    }

    // Animate the waves
    function animateWaves() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
      waves.forEach((wave, index) => {
        wave.update();
        wave.draw();

        // Remove the wave if it has faded out
        if (wave.opacity <= 0) {
          waves.splice(index, 1);
        }
      });

      // Generate new waves occasionally
      if (Math.random() < 0.05) {
        createWaves();
      }

      requestAnimationFrame(animateWaves);  // Repeat the animation
    }

    animateWaves();

    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener('resize', null);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none z-0"></canvas>;
};

export default ComplexWaveAnimation;
