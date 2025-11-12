import React, { useEffect, useRef } from 'react';
import Sketch from 'react-p5';

const AuraVisualization = ({ sentiment, emotion }) => {
  const noiseOffsetRef = useRef(0);
  const particlesRef = useRef([]);
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    p5.background(0);
    
    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < 2000; i++) {
      particlesRef.current.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: 0,
        vy: 0,
        size: p5.random(1, 3)
      });
    }
    
    console.log('P5 setup complete - particles created:', particlesRef.current.length);
  };

  const draw = (p5) => {
    // Semi-transparent background for trail effect
    p5.fill(0, 0, 0, 30);
    p5.rect(0, 0, p5.width, p5.height);
    
    // Map sentiment to colors - MUCH BRIGHTER
    let particleColor;
    let bgHue;
    
    if (sentiment > 0.5) {
      // POSITIVE - Bright warm colors (yellow, orange, red)
      bgHue = p5.map(sentiment, 0.5, 1, 45, 15); // Yellow to orange-red
      particleColor = p5.color(
        p5.map(sentiment, 0.5, 1, 255, 255), // Red
        p5.map(sentiment, 0.5, 1, 200, 150), // Green
        50, // Blue (low)
        200 // Alpha (brightness)
      );
    } else if (sentiment < -0.5) {
      // NEGATIVE - Bright cool colors (blue, cyan)
      bgHue = p5.map(sentiment, -0.5, -1, 200, 220); // Cyan to blue
      particleColor = p5.color(
        50, // Red (low)
        p5.map(sentiment, -0.5, -1, 150, 100), // Green
        p5.map(sentiment, -0.5, -1, 255, 255), // Blue
        200 // Alpha
      );
    } else {
      // NEUTRAL - Bright purple/magenta
      particleColor = p5.color(
        200, // Red
        100, // Green
        255, // Blue
        200 // Alpha
      );
    }
    
    // Perlin noise parameters
    let noiseScale = p5.map(Math.abs(sentiment), 0, 1, 0.002, 0.01);
    let noiseStrength = p5.map(Math.abs(sentiment), 0, 1, 0.5, 4);
    let speed = p5.map(Math.abs(sentiment), 0, 1, 0.002, 0.01);
    
    noiseOffsetRef.current += speed;
    
    // Draw particles
    particlesRef.current.forEach(particle => {
      // Get noise value
      let noiseVal = p5.noise(
        particle.x * noiseScale + noiseOffsetRef.current,
        particle.y * noiseScale,
        noiseOffsetRef.current
      );
      
      // Convert to angle
      let angle = noiseVal * p5.TWO_PI * 4;
      
      // Update velocity
      particle.vx = p5.cos(angle) * noiseStrength;
      particle.vy = p5.sin(angle) * noiseStrength;
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = p5.width;
      if (particle.x > p5.width) particle.x = 0;
      if (particle.y < 0) particle.y = p5.height;
      if (particle.y > p5.height) particle.y = 0;
      
      // Draw particle
      p5.fill(particleColor);
      p5.noStroke();
      p5.circle(particle.x, particle.y, particle.size);
    });
    
    // Add glow effect for positive emotions
    if (sentiment > 0.5) {
      p5.fill(255, 200, 100, 20);
      p5.circle(p5.width / 2, p5.height / 2, 500);
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
};

export default AuraVisualization;