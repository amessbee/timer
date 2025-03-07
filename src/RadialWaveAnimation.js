import React, { useEffect, useRef } from 'react';

const RadialWaveAnimation = ({ animationIntensity }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const waves = [];
    const intensity = 0.01*animationIntensity*0.01*animationIntensity || 0.05;

    // Improve canvas resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    // Function to get a random position on the screen
    const getRandomCenter = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    });
    // Generate 10 random centers
    const randomCenters = Array.from({ length: 10 }, () => getRandomCenter());

    // Generate unique functions (same as before)
    const geometricFunctions = [
      (wave) => { wave.x += wave.speed; wave.y += Math.sin(wave.x * 0.005) * 5; },   // Sine wave
      (wave) => { wave.x -= wave.speed; wave.y += Math.sin(wave.x * 0.005) * 5; },   // Reverse Sine wave
      (wave) => { 
        wave.angle += wave.speed * 0.05;
        wave.x = randomCenters[0].x + wave.radius * Math.cos(wave.angle);
        wave.y = randomCenters[0].y + wave.radius * Math.sin(wave.angle);
        wave.radius += wave.growthRate;
      },
      (wave) => { 
        wave.angle += wave.speed * 0.05;
        wave.x = randomCenters[1].x + wave.radius * Math.cos(wave.angle);
        wave.y = randomCenters[1].y + wave.radius * Math.sin(wave.angle);
        wave.radius += wave.growthRate;
      },

      (wave) => { 
        wave.angle += wave.speed * 0.05;
        wave.x = randomCenters[2].x + wave.radius * Math.cos(wave.angle);
        wave.y = randomCenters[2].y + wave.radius * Math.sin(wave.angle);
        wave.radius += wave.growthRate;
      },

      (wave) => { 
        wave.angle += wave.speed * 0.05;
        wave.x = randomCenters[3].x + wave.radius * Math.cos(wave.angle);
        wave.y = randomCenters[3].y + wave.radius * Math.sin(wave.angle);
        wave.radius += wave.growthRate;
      },

      (wave) => { 
        wave.angle += wave.speed * 0.05;
        wave.x = randomCenters[4].x + wave.radius * Math.cos(wave.angle);
        wave.y = randomCenters[4].y + wave.radius * Math.sin(wave.angle);
        wave.radius += wave.growthRate;
      },
      (wave) => { wave.x += Math.cos(wave.angle) * wave.speed; wave.y += Math.sin(wave.angle) * wave.speed; wave.angle += 0.05; },  // Circle motion
      // (wave) => { wave.x += wave.speed; wave.y += Math.tan(wave.x * 0.002) * 5; },   // Tangent wave
      (wave) => { wave.x = wave.x + Math.cos(wave.angle) * wave.radius; wave.y = wave.y + Math.sin(wave.angle) * wave.radius; wave.angle += wave.growthRate; }, // Elliptical motion
      // (wave) => { wave.x += wave.speed; wave.y += (Math.pow(wave.x * 0.05, 2) * 0.5) - 50; },  // Parabolic curve
      (wave) => { wave.x += Math.sin(wave.angle) * wave.speed; wave.y += Math.cos(wave.angle) * wave.speed; wave.angle += wave.growthRate; },  // Hypotrochoid (circular path within a circle)
      // (wave) => { wave.x += wave.speed; wave.y += Math.abs(Math.sin(wave.x * 0.02) * 50); },  // Abs(sine) wave (bounces)
      // (wave) => { wave.x += wave.speed; wave.y = 300 + Math.sin(wave.angle) * wave.radius; wave.angle += 0.03; wave.radius += wave.growthRate; },  // Vertical sine waves
    ];
  
    // Generate geometric functions using 10 different random centers
    // const geometricFunctions = randomCenters.map((_, index) => generateSineWaveFunctions(index)).flat();


    // Geometric Wave class for various complex functions
    class GeometricWave {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.angle = 0;
        this.radius = Math.random() * 50 + 1;
        this.growthRate = Math.random() * 0.02 + 0.01;
        this.speed = Math.random() * 2 + 1;
        this.opacity = 1;
        this.fadeRate = 0.005;
        this.sizeFactor = Math.random();
        this.animationFunc = geometricFunctions[Math.floor(Math.random() * geometricFunctions.length)];
        
        // Improved 3D bubble properties
        this.color = {
          r: Math.floor(Math.random() * 40) + 200, // Brighter colors
          g: Math.floor(Math.random() * 40) + 200,
          b: Math.floor(Math.random() * 80) + 190
        };
        this.highlightAngle = Math.random() * Math.PI * 2;
        this.highlightSize = 0.3 + Math.random() * 0.2;
        this.shadowOpacity = 0.2 + Math.random() * 0.3;
      }

      update() {
        this.animationFunc(this);
        this.opacity -= this.fadeRate;
      }

      draw(factor = 1) {
        if (this.opacity <= 0) return;
        
        // Sharper bubble sizes
        const bubbleSize = Math.round(factor * 50);
        // const x = Math.round(this.x);
        // const y = Math.round(this.y);
        const x = this.x;
        const y = this.y;
        
        // Improved gradient positioning
        const gradient = ctx.createRadialGradient(
          x - bubbleSize * 0.3,
          y - bubbleSize * 0.3,
          0, // Start from center point
          x, 
          y, 
          bubbleSize
        );
        
        const { r, g, b } = this.color;
        
        // Sharper contrast in gradient steps
        gradient.addColorStop(0,   `rgba(255, 255, 255, ${this.opacity * 1.0})`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.9})`);
        gradient.addColorStop(0.7, `rgba(${r-20}, ${g-20}, ${b}, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.9, `rgba(${r-40}, ${g-40}, ${b-20}, ${this.opacity * 0.7})`);
        gradient.addColorStop(1, `rgba(${r-60}, ${g-60}, ${b-30}, ${this.opacity * 0.4})`);
        
        // Draw with anti-aliasing disabled for sharper edges
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Main bubble
        ctx.beginPath();
        ctx.arc(x, y, bubbleSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add thin outline for definition
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.stroke();
        
        // Sharper highlight reflection
        const highlightX = x - bubbleSize * 0.35;
        const highlightY = y - bubbleSize * 0.35;
        const highlightRadius = bubbleSize * this.highlightSize;
        
        const highlightGradient = ctx.createRadialGradient(
          highlightX, highlightY, 0,
          highlightX, highlightY, highlightRadius
        );
        
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.95})`);
        highlightGradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
        highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, highlightRadius, 0, Math.PI * 2);
        ctx.fillStyle = highlightGradient;
        ctx.fill();
        
        // Add a second smaller highlight for more realism
        const smallHighlightX = x + bubbleSize * 0.2;
        const smallHighlightY = y + bubbleSize * 0.2;
        const smallHighlightRadius = bubbleSize * 0.1;
        
        ctx.beginPath();
        ctx.arc(smallHighlightX, smallHighlightY, smallHighlightRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.7})`;
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Create and animate waves (same as before)
    function createWaves() {
      waves.push(new GeometricWave());
    }

    function animateWaves() {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      waves.sort((a, b) => (b.radius * b.sizeFactor) - (a.radius * a.sizeFactor));
      
      waves.forEach((wave, index) => {
        wave.update();
        wave.draw(wave.sizeFactor);

        if (wave.opacity <= 0) {
          waves.splice(index, 1);
        }
      });

      if (Math.random() < intensity) {
        createWaves();
      }

      requestAnimationFrame(animateWaves);
    }

    animateWaves();

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [animationIntensity]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none z-0"></canvas>;
};

export default RadialWaveAnimation;