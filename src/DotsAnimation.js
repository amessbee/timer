import React, { useEffect, useRef } from 'react';

const DotsAnimation = () => {
    const canvasRef = useRef(null);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const particles = [];
  
      // Canvas dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      // Particle class
      class Particle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.size = Math.random() * 50 * Math.random() * Math.random() + 1;
          this.speedX = Math.random() * 3 - 1.5;
          this.speedY = Math.random() * 3 - 1.5;
        }
  
        // Update the particle position
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          if (this.size > 0.1) this.size -= 0.1;
        }
  
        // Draw the particle
        draw() {
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
      }
  
      // Create initial particles
      function createParticles() {
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          particles.push(new Particle(x, y));
        }
      }
  
      // Handle animation
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle, index) => {
          particle.update();
          particle.draw();
  
          // Remove particles that are too small
          if (particle.size <= 0.1) {
            particles.splice(index, 1);
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
          }
        });
        requestAnimationFrame(animate);
      }
  
      createParticles();
      animate();
    }, []);
  
    return <canvas ref={canvasRef} className="absolute top-0 left-0 z-0 pointer-events-none"></canvas>;
  };
