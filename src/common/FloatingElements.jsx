/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

const FloatingElement = ({
  children,
  delay = 0,
  duration = 5,
  x = 0,
  y = 10,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        y: [y, -y, y],
        x: [x, -x, x],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: {
          repeat: Number.POSITIVE_INFINITY,
          duration,
          ease: "easeInOut",
          delay,
        },
        x: {
          repeat: Number.POSITIVE_INFINITY,
          duration: duration * 1.3,
          ease: "easeInOut",
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const FloatingElements = ({
  children,
  count = 5,
  size = 100,
  colors = ["#3a36db", "#00c6b6", "#ff5757"],
}) => {
  const elements = [];

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 100 + 50;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = Math.random() * 5 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.1 + 0.05;

    elements.push(
      <Box
        key={i}
        component={motion.div}
        sx={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`,
          opacity,
          filter: "blur(20px)",
          top: `${y}%`,
          left: `${x}%`,
          transform: "translate(-50%, -50%)",
          zIndex: 0,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
        }}
        transition={{
          y: {
            repeat: Number.POSITIVE_INFINITY,
            duration,
            ease: "easeInOut",
            delay,
          },
          x: {
            repeat: Number.POSITIVE_INFINITY,
            duration: duration * 1.2,
            ease: "easeInOut",
            delay,
          },
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {elements}
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
};

export { FloatingElement, FloatingElements };
