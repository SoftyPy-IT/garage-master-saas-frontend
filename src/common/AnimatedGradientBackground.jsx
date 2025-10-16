/* eslint-disable react/prop-types */
"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const AnimatedGradientBackground = ({
  children,
  intensity = 0.5,
  speed = 0.005,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create gradient colors
    const colors = [
      { r: 58, g: 54, b: 219, a: 0.5 * intensity }, // Primary
      { r: 0, g: 198, b: 182, a: 0.5 * intensity }, // Secondary
      { r: 255, g: 87, b: 87, a: 0.3 * intensity }, // Accent
    ];

    // Create blobs
    const blobs = [];
    for (let i = 0; i < 5; i++) {
      blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 300 + 100,
        xSpeed: (Math.random() - 0.5) * speed * 100,
        ySpeed: (Math.random() - 0.5) * speed * 100,
        color: colors[i % colors.length],
      });
    }

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw blobs
      blobs.forEach((blob) => {
        // Move blob
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;

        // Bounce off edges
        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        if (blob.y > height + blob.radius) blob.y = -blob.radius;

        // Draw blob
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );

        gradient.addColorStop(
          0,
          `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${blob.color.a})`
        );
        gradient.addColorStop(
          1,
          `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0)`
        );

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [intensity, speed]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
};

export default AnimatedGradientBackground;
