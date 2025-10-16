/* eslint-disable react/no-unescaped-entities */
"use client"

import { Box, Container, Grid, Typography, Stack, Button, Divider, alpha } from "@mui/material"
import { AutoFixHigh } from "@mui/icons-material"
import { motion } from "framer-motion"

export const FooterSection = () => {
  const footerSections = [
    {
      title: "Product",
      items: ["🚀 Features", "🔄 Workflow", "💎 Pricing", "🎬 Demo", "📱 Mobile App"],
    },
    {
      title: "Company",
      items: ["🏢 About", "💼 Careers", "📞 Contact", "📝 Blog", "🏆 Success Stories"],
    },
    {
      title: "Support",
      items: ["❓ Help Center", "📚 Documentation", "👥 Community", "📊 Status", "🎓 Training"],
    },
    {
      title: "Solutions",
      items: ["🔧 Implementation", "🎯 Consultancy", "📈 Analytics", "🔌 Integrations", "🏅 Enterprise"],
    },
  ]

  return (
    <Box sx={{ bgcolor: "#0a0a0a", color: "#ffffff", py: 12 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  borderRadius: "50%",
                  p: 2,
                }}
              >
                <AutoFixHigh sx={{ fontSize: 32 }} />
              </Box>
              <Typography sx={{ color: "#fff" }} variant="h4" fontWeight="bold">
                Garage Master
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                mb: 4,
                lineHeight: 1.7,
                fontSize: "1.1rem",
              }}
            >
              The world's most advanced garage management platform. Complete workflow solution from customer to payment
              with AI-powered insights and automation.
            </Typography>
            <Stack direction="row" spacing={3}>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: alpha("#ffffff", 0.3),
                    color: "#ffffff",
                    "&:hover": {
                      borderColor: "#ffffff",
                      background: alpha("#ffffff", 0.1),
                    },
                  }}
                >
                  Privacy Policy
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: alpha("#ffffff", 0.3),
                    color: "#ffffff",
                    "&:hover": {
                      borderColor: "#ffffff",
                      background: alpha("#ffffff", 0.1),
                    },
                  }}
                >
                  Terms of Service
                </Button>
              </motion.div>
            </Stack>
          </Grid>
          {footerSections.map((section, index) => (
            <Grid item xs={6} md={2} key={index}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {section.title}
              </Typography>
              <Stack spacing={2}>
                {section.items.map((item) => (
                  <motion.div key={item} whileHover={{ x: 5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.8,
                        cursor: "pointer",
                        fontSize: "1rem",
                        "&:hover": {
                          opacity: 1,
                          color: "#3b82f6",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {item}
                    </Typography>
                  </motion.div>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 6, borderColor: alpha("#ffffff", 0.1) }} />
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={3}>
          <Typography variant="body1" sx={{ opacity: 0.6 }}>
            © 2024 Garage Master. All rights reserved. Built with ❤️ for garage owners worldwide.
          </Typography>
          <Stack direction="row" spacing={4} alignItems="center">
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              🌟 Trusted by 2,500+ garages
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              🚀 Complete Workflow Solution
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              🏆 Industry Leader
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
