/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";

const AnimatedCounter = ({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  variant = "h3",
  color = "inherit",
  fontWeight = "bold",
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    // Reset animation when value changes
    setCount(0);
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = (timestamp - startTimeRef.current) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(value * Math.min(progress, 1)));
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <Typography
      variant={variant}
      color={color}
      fontWeight={fontWeight}
      ref={countRef}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </Typography>
  );
};

export default AnimatedCounter;
