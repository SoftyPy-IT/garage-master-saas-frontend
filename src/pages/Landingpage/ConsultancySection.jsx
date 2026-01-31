"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  alpha,
} from "@mui/material";
import {
  Phone,
  Business,
  AutoFixHigh,
  Support,
  TrendingUp,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const ConsultancySection = () => {
  const services = [
    {
      icon: <Business />,
      title: "Business Analysis",
      description:
        "Complete assessment of your current operations and growth opportunities",
    },
    {
      icon: <AutoFixHigh />,
      title: "Custom Setup",
      description:
        "Tailored system configuration to match your specific business needs",
    },
    {
      icon: <Support />,
      title: "Training & Support",
      description:
        "Comprehensive team training and ongoing support for maximum success",
    },
    {
      icon: <TrendingUp />,
      title: "Growth Strategy",
      description:
        "Data-driven recommendations to accelerate your business growth",
    },
  ];

  const implementationItems = [
    "✅ Complete system setup & configuration",
    "📊 Data migration from existing systems",
    "👨‍🏫 Staff training & onboarding sessions",
    "📱 Mobile app setup for your team",
    "🔧 Custom workflow optimization",
    "📞 30 days of priority support",
    "📈 Performance monitoring & optimization",
    "🎯 Growth strategy consultation",
  ];

  return (
    <Box id="consultancy" sx={{ py: 15 }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 4,
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: { xs: "2.5rem", md: "4rem" },
                }}
              >
                🎯 Expert Consultancy
                <Box component="span" sx={{ display: "block" }}>
                  & Implementation
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  lineHeight: 1.6,
                  fontWeight: 500,
                  color: alpha("#ffffff", 0.8),
                }}
              >
                Get personalized guidance from our garage management experts.
                We'll help you implement the perfect workflow and maximize your
                ROI from day one.
              </Typography>
              <Grid container spacing={4} sx={{ mb: 6 }}>
                {services.map((service, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 4,
                          background: alpha("#1e293b", 0.5),
                          backdropFilter: "blur(20px)",
                          border: `1px solid ${alpha("#06b6d4", 0.1)}`,
                          "&:hover": {
                            boxShadow: `0 15px 40px ${alpha("#06b6d4", 0.1)}`,
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Box
                          sx={{
                            background:
                              "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                            borderRadius: "50%",
                            p: 1.5,
                            display: "inline-flex",
                            mb: 2,
                          }}
                        >
                          {React.cloneElement(service.icon, {
                            sx: { color: "#ffffff", fontSize: 24 },
                          })}
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          gutterBottom
                          sx={{ color: "#ffffff" }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: alpha("#ffffff", 0.8) }}
                        >
                          {service.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://wa.me/8801670405744"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Phone />}
                    sx={{
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                      px: 6,
                      py: 3,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      borderRadius: 4,
                      boxShadow: `0 15px 50px ${alpha("#06b6d4", 0.4)}`,
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                        boxShadow: `0 20px 60px ${alpha("#06b6d4", 0.5)}`,
                      },
                    }}
                  >
                    📞 Book Free Consultation
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: 6,
                  background: alpha("#1e293b", 0.5),
                  backdropFilter: "blur(20px)",
                  border: `2px solid ${alpha("#ffffff", 0.2)}`,
                  boxShadow: `0 25px 80px ${alpha("#06b6d4", 0.2)}`,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "#06b6d4" }}
                >
                  🚀 Implementation Package
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    lineHeight: 1.7,
                    color: alpha("#ffffff", 0.8),
                  }}
                >
                  Get your garage up and running with our complete
                  implementation package. Everything you need for a successful
                  digital transformation.
                </Typography>
                <List disablePadding>
                  {implementationItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem disableGutters sx={{ py: 1 }}>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: "body1",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 3,
                    background: alpha("#10b981", 0.1),
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "#10b981", mb: 1 }}
                  >
                    💰 Implementation Value: $2,500
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: alpha("#ffffff", 0.8) }}
                  >
                    FREE with annual subscription
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ConsultancySection;
