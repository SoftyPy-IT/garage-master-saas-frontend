/* eslint-disable react/prop-types */
"use client"
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material"
import { Check } from "@mui/icons-material"
import { motion } from "framer-motion"

const PricingSection = ({ pricingPlans }) => {
  return (
    <Box id="pricing" sx={{ py: 15 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 12 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 4,
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "2.5rem", md: "4rem" },
              }}
            >
              💎 Simple Pricing
              <Box component="span" sx={{ display: "block" }}>
                Maximum Value
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: alpha("#ffffff", 0.8),
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Choose the perfect plan for your garage business. All plans include our complete workflow system and
              premium support.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Chip
                label="🎉 Limited Time: 50% OFF"
                sx={{
                  background: "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                  color: "#ffffff",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  fontSize: "1rem",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                    "100%": { transform: "scale(1)" },
                  },
                }}
              />
              <Chip
                label="⚡ 30-Day FREE Trial"
                sx={{
                  background: alpha("#10b981", 0.1),
                  color: "#10b981",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  fontSize: "1rem",
                }}
              />
            </Stack>
          </motion.div>
        </Box>
        <Grid container spacing={6} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -20,
                  scale: plan.popular ? 1.08 : 1.05,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 5,
                    borderRadius: 6,
                    position: "relative",
                    background: plan.popular ? alpha("#1e293b", 0.8) : alpha("#ffffff", 0.05),
                    backdropFilter: "blur(20px)",
                    border: plan.popular ? `3px solid #06b6d4` : `2px solid ${alpha("#06b6d4", 0.1)}`,
                    transform: plan.popular ? "scale(1.05)" : "scale(1)",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: plan.popular
                        ? `0 40px 120px ${alpha("#06b6d4", 0.3)}`
                        : `0 30px 80px ${alpha("#06b6d4", 0.15)}`,
                      "&::before": {
                        opacity: 1,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                      opacity: plan.popular ? 1 : 0.7,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                >
                  {plan.popular && (
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Chip
                        label="🏆 MOST POPULAR"
                        sx={{
                          position: "absolute",
                          top: -15,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                          color: "#ffffff",
                          fontWeight: 800,
                          px: 3,
                          py: 1,
                          fontSize: "0.9rem",
                          boxShadow: `0 8px 25px ${alpha("#06b6d4", 0.4)}`,
                        }}
                      />
                    </motion.div>
                  )}
                  <Box
                    sx={{
                      textAlign: "center",
                      mb: 5,
                      mt: plan.popular ? 3 : 0,
                    }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        color: "#fff",
                      }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#fff",
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      }}
                      gutterBottom
                    >
                      {plan.description}
                    </Typography>
                    <Box sx={{ my: 4 }}>
                      <Stack direction="row" alignItems="baseline" justifyContent="center" spacing={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            textDecoration: "line-through",
                            color: alpha("#ffffff", 0.6),
                            opacity: 0.7,
                          }}
                        >
                          ${plan.originalPrice}
                        </Typography>
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 900,
                            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          ${plan.price}
                        </Typography>
                        <Typography variant="h6" sx={{ color: alpha("#ffffff", 0.6) }}>
                          /{plan.period}
                        </Typography>
                      </Stack>
                      <Chip
                        label={plan.savings}
                        size="small"
                        sx={{
                          mt: 2,
                          background: alpha("#10b981", 0.1),
                          color: "#10b981",
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Box>
                  <List disablePadding sx={{ mb: 5 }}>
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: featureIndex * 0.1 }}
                      >
                        <ListItem
                          disableGutters
                          sx={{
                            py: 1.5,
                            "&:hover": {
                              transform: "translateX(10px)",
                              "& .MuiListItemIcon-root": {
                                transform: "scale(1.2) rotate(360deg)",
                              },
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Check
                              sx={{
                                color: "#10b981",
                                fontSize: 22,
                                filter: `drop-shadow(0 2px 4px ${alpha("#10b981", 0.3)})`,
                                transition: "all 0.3s ease",
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: "body1",
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#fff",
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={plan.popular ? "contained" : "outlined"}
                      fullWidth
                      size="large"
                      sx={{
                        py: 3,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        borderRadius: 4,
                        ...(plan.popular
                          ? {
                              background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                              boxShadow: `0 15px 40px ${alpha("#06b6d4", 0.4)}`,
                              "&:hover": {
                                background: "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                                boxShadow: `0 20px 50px ${alpha("#06b6d4", 0.5)}`,
                              },
                            }
                          : {
                              borderWidth: 3,
                              borderColor: "#06b6d4",
                              color: "#06b6d4",
                              "&:hover": {
                                borderWidth: 3,
                                background: alpha("#06b6d4", 0.1),
                                boxShadow: `0 15px 40px ${alpha("#06b6d4", 0.2)}`,
                              },
                            }),
                      }}
                    >
                      🚀 Start {plan.popular ? "Premium" : "Free"} Trial
                    </Button>
                  </motion.div>
                  {plan.popular && (
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                      <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.6) }}>
                        ⚡ Most chosen by successful garages
                      </Typography>
                    </Box>
                  )}
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default PricingSection
