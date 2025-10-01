"use client";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Stack,
  alpha,
} from "@mui/material";
import {
  PlayArrow,
  Security,
  Support,
  CloudSync,
  Rocket,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { FloatingParticles } from "./FloatingParticle";

const FinalCTASection = () => {
  return (
    <Box
      sx={{
        py: 15,
        background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingParticles />
      <Container
        maxWidth="md"
        sx={{ textAlign: "center", position: "relative", zIndex: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: "3rem", md: "5rem" },
                lineHeight: 0.9,
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              🚀 Ready to Transform
              <Box component="span" sx={{ display: "block" }}>
                Your Garage Business?
              </Box>
            </Typography>
          </motion.div>
          <Typography
            variant="h5"
            sx={{
              mb: 8,
              opacity: 0.95,
              lineHeight: 1.6,
              maxWidth: 800,
              mx: "auto",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Join over <strong>2,500 successful garage owners</strong> who have
            revolutionized their business with our complete workflow solution.
            Start your transformation today with our{" "}
            <strong>30-day FREE trial</strong> - no credit card required!
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
            sx={{ mb: 8 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Rocket />}
                sx={{
                  background: "#ffffff",
                  color: "#06b6d4",
                  px: 8,
                  py: 3,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  "&:hover": {
                    background: alpha("#ffffff", 0.95),
                    boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
                  },
                }}
              >
                🎉 START FREE 30-DAY TRIAL
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  borderWidth: 3,
                  borderColor: "#ffffff",
                  color: "#ffffff",
                  px: 8,
                  py: 3,
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  borderRadius: 4,
                  "&:hover": {
                    borderWidth: 3,
                    background: alpha("#ffffff", 0.1),
                    boxShadow: "0 15px 40px rgba(255,255,255,0.2)",
                  },
                }}
              >
                🎬 Watch Live Demo
              </Button>
            </motion.div>
          </Stack>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ opacity: 0.9 }}
          >
            <Grid item xs={12} sm={4}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Security sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Enterprise Security
                  </Typography>
                  <Typography variant="body2">Bank-level encryption</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Support sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    24/7 VIP Support
                  </Typography>
                  <Typography variant="body2">
                    Dedicated success team
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <CloudSync sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    99.99% Uptime
                  </Typography>
                  <Typography variant="body2">Always available</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FinalCTASection;
