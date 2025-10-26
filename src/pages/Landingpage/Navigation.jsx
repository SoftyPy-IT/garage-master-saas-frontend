/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AutoFixHigh,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Navigation = ({ scrollToSection }) => {
  const theme = useTheme();

  // Enhanced breakpoints for different device sizes
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm")); // Mobile phones
  const isSmall = useMediaQuery(theme.breakpoints.between("sm", "md")); // Tablets
  const isMedium = useMediaQuery(theme.breakpoints.between("md", "lg")); // Small laptops
  const isLarge = useMediaQuery(theme.breakpoints.up("lg")); // Large screens
  // const isExtraLarge = useMediaQuery(theme.breakpoints.up("xl")) // Extra large screens

  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Mobile & tablets

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: "Features", id: "features" },
    { label: "Workflow", id: "workflow" },
    { label: "Pricing", id: "pricing" },
    { label: "Clients", id: "clients" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Consultancy", id: "consultancy" },
    { label: "Contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  // Enhanced responsive styles for all menu items
  const getResponsiveStyles = () => ({
    logo: {
      extraSmall: { variant: "h6", size: "1.1rem" },
      small: { variant: "h5", size: "1.4rem" },
      medium: { variant: "h5", size: "1.5rem" },
      large: { variant: "h5", size: "1.6rem" },
      extraLarge: { variant: "h5", size: "1.8rem" },
    },
    navButton: {
      extraSmall: {  },
      small: { px: 1, fontSize: "0.7rem", minWidth: "auto" },
      medium: { px: 1.2, fontSize: "0.75rem", minWidth: "auto" },
      large: { px: 3, fontSize: "0.8rem", minWidth: "auto" },
      extraLarge: { px: 2, fontSize: "0.85rem", minWidth: "auto" },
    },
    authButton: {
      extraSmall: { px: 1.5, fontSize: "0.65rem" },
      small: { px: 2, fontSize: "0.7rem" },
      medium: { px: 2.5, fontSize: "0.75rem" },
      large: { px: 1.5, fontSize: "0.8rem" },
      extraLarge: { px: 3.5, fontSize: "0.85rem" },
    },
    spacing: {
      extraSmall: 0.3,
      small: 0.5,
      medium: 0.8,
      large: 1,
      extraLarge: 1.2,
    },
  });

  const responsiveStyles = getResponsiveStyles();

  const getCurrentSize = () => {
    if (isExtraSmall) return "extraSmall";
    if (isSmall) return "small";
    if (isMedium) return "medium";
    if (isLarge) return "large";
    return "extraLarge";
  };

  const currentSize = getCurrentSize();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? alpha("#0f172a", 0.95) : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${alpha("#334155", 0.3)}`
            : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: {
              xs: 1, 
              sm: 2, 
              md: 0, 
              lg: 4, 
              xl: 0, 
            },
          }}
        >
          <Toolbar
            sx={{
              px: { xs: 0, sm: 0.5, md: 1 },
              minHeight: {
                xs: 56, 
                sm: 64, 
                md: 72, 
                lg: 80, 
              },
            }}
          >
            {/* Logo Section */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1, sm: 1.5, md: 2, lg: 2.5 }}
              sx={{ flexGrow: 1, minWidth: 0 }}
            >
              <motion.div
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1,
                }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    width: {
                      xs: 30, 
                      sm: 34, 
                      md: 38, 
                      lg: 42, 
                      xl: 44, 
                    },
                    height: {
                      xs: 30,
                      sm: 34,
                      md: 38,
                      lg: 42,
                      xl: 44,
                    },
                    background:
                      "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 32px ${alpha("#06b6d4", 0.3)}`,
                    flexShrink: 0,
                  }}
                >
                  <AutoFixHigh
                    sx={{
                      color: "white",
                      fontSize: {
                        xs: 16, 
                        sm: 18, 
                        md: 20, 
                        lg: 22, 
                        xl: 24, 
                      },
                    }}
                  />
                </Box>
              </motion.div>

              <Typography
                variant={responsiveStyles.logo[currentSize].variant}
                component="div"
                sx={{
                  fontWeight: 900,
                  letterSpacing: {
                    xs: "-0.3px",
                    sm: "-0.5px",
                    md: "-0.7px",
                    lg: "-0.9px",
                    xl: "-1px",
                  },
                  color: "#fff",
                  fontSize: responsiveStyles.logo[currentSize].size,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Garage Master
              </Typography>
            </Stack>

            {/* Desktop Navigation - Show ALL items */}
            {!isMobile ? (
              <Stack
                direction="row"
                spacing={responsiveStyles.spacing[currentSize]}
                alignItems="center"
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexWrap: "nowrap",
                  flexShrink: 1,
                  minWidth: 0,
                }}
              >
                {/* Show ALL navigation items with responsive text */}
                {navItems.map((item) => (
                  <motion.div key={item.id} whileHover={{ y: -2 }}>
                    <Button
                       variant="text"
                      onClick={() => handleNavClick(item.id)}
                      sx={{ 
                        fontWeight: {
                          md: 500,
                          lg: 600,
                          xl: 700,
                        },
                        px: responsiveStyles.navButton[currentSize].px,
                        py: {
                          md: 0.8,
                          lg: 1,
                          xl: 1.2,
                        },
                        borderRadius: 2,
                        color: alpha("#ffffff", 0.85),
                        fontSize:
                          responsiveStyles.navButton[currentSize].fontSize,
                        minWidth:
                          responsiveStyles.navButton[currentSize].minWidth,
                        whiteSpace: "nowrap",
                        lineHeight: 1.2,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${alpha(
                            "#06b6d4",
                            0.1
                          )} 0%, ${alpha("#3b82f6", 0.1)} 100%)`,
                          color: "#ffffff",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      
                    {item.label}
                    </Button>
                  </motion.div>
                ))}

                {/* Auth Buttons with compact design */}
                <Stack
                  direction="row"
                  spacing={responsiveStyles.spacing[currentSize]}
                  alignItems="center"
                  sx={{
                    ml: {
                      md: 0.5,
                      lg: 1,
                      xl: 1.5,
                    },
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/login"
                      sx={{
                        borderWidth: { md: 1.5, lg: 2 },
                        borderColor: "#06b6d4",
                        color: "#06b6d4",
                        fontWeight: {
                          md: 500,
                          lg: 600,
                          xl: 700,
                        },
                        px: responsiveStyles.authButton[currentSize].px,
                        py: {
                          md: 0.5,
                          lg: 2,
                          xl: 2,
                        },
                        borderRadius: 2,
                        fontSize:
                          responsiveStyles.authButton[currentSize].fontSize,
                        whiteSpace: "nowrap",
                        minWidth: "auto",
                        lineHeight: 1.2,
                        "&:hover": {
                          borderWidth: { md: 1.5, lg: 2 },
                          background: alpha("#06b6d4", 0.1),
                          transform: "translateY(-1px)",
                          boxShadow: `0 4px 12px ${alpha("#06b6d4", 0.3)}`,
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Login
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                        fontWeight: {
                          md: 500,
                          lg: 600,
                          xl: 700,
                        },
                        px: responsiveStyles.authButton[currentSize].px,
                        py: {
                          md: 0.5,
                          lg: 2,
                          xl: 2,
                        },
                        borderRadius: 2,
                        fontSize:
                          responsiveStyles.authButton[currentSize].fontSize,
                        boxShadow: `0 4px 16px ${alpha("#06b6d4", 0.4)}`,
                        whiteSpace: "nowrap",
                        minWidth: "auto",
                        lineHeight: 1.2,
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                          transform: "translateY(-2px)",
                          boxShadow: `0 6px 20px ${alpha("#06b6d4", 0.5)}`,
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isMedium ? "🚀 Trial" : "🚀 Start Free Trial"}
                    </Button>
                  </motion.div>
                </Stack>
              </Stack>
            ) : (
              /* Mobile Menu Button */
              <IconButton
                color="inherit"
                onClick={() => setIsMenuOpen(true)}
                sx={{
                  display: { md: "none" },
                  p: { xs: 1, sm: 1.2 },
                }}
              >
                <MenuIcon
                  sx={{
                    fontSize: {
                      xs: 24, // Extra small
                      sm: 28, // Small
                      md: 32, // Medium
                    },
                    color: "white",
                  }}
                />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "85%", // Extra small
              sm: "75%", // Small
              md: "65%", // Medium
            },
            maxWidth: 400,
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            color: "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            p: {
              xs: 2, // Extra small
              sm: 2.5, // Small
              md: 3, // Medium
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            fontSize={{
              xs: "1.1rem",
              sm: "1.3rem",
              md: "1.4rem",
            }}
          >
            Menu
          </Typography>
          <IconButton color="inherit" onClick={() => setIsMenuOpen(false)}>
            <CloseIcon
              sx={{
                fontSize: {
                  xs: 20, // Extra small
                  sm: 24, // Small
                  md: 28, // Medium
                },
              }}
            />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: alpha("#ffffff", 0.2) }} />

        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              sx={{
                cursor: "pointer",
                py: {
                  xs: 1.25, // Extra small
                  sm: 1.5, // Small
                  md: 1.75, // Medium
                },
                px: {
                  xs: 2, // Extra small
                  sm: 2.5, // Small
                  md: 3, // Medium
                },
                "&:hover": {
                  background: alpha("#ffffff", 0.1),
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: {
                    xs: "0.95rem", // Extra small
                    sm: "1.05rem", // Small
                    md: "1.1rem", // Medium
                  },
                  fontWeight: 500,
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            p: {
              xs: 2, // Extra small
              sm: 2.5, // Small
              md: 3, // Medium
            },
            mt: "auto",
            display: "flex",
            flexDirection: "column",
            gap: {
              xs: 1.25, // Extra small
              sm: 1.5, // Small
              md: 2, // Medium
            },
          }}
        >
          <Button
            component={Link}
            to="/login"
            fullWidth
            color="inherit"
            sx={{
              py: {
                xs: 0.9, // Extra small
                sm: 1.1, // Small
                md: 1.25, // Medium
              },
              fontSize: {
                xs: "0.85rem", // Extra small
                sm: "0.9rem", // Small
                md: "0.95rem", // Medium
              },
              border: `1px solid ${alpha("#ffffff", 0.3)}`,
              fontWeight: 500,
            }}
          >
            Login
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{
              background: "#ffffff",
              color: "#06b6d4",
              py: {
                xs: 0.9, // Extra small
                sm: 1.1, // Small
                md: 1.25, // Medium
              },
              fontSize: {
                xs: "0.85rem", // Extra small
                sm: "0.9rem", // Small
                md: "0.95rem", // Medium
              },
              fontWeight: 600,
              "&:hover": {
                background: alpha("#ffffff", 0.9),
                transform: "translateY(-1px)",
                boxShadow: `0 6px 20px ${alpha("#000000", 0.2)}`,
              },
              transition: "all 0.2s ease",
            }}
          >
            Start Free Trial
          </Button>
        </Box>
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Toolbar
        sx={{
          minHeight: {
            xs: 56, // Extra small
            sm: 64, // Small
            md: 72, // Medium
            lg: 80, // Large & Extra large
          },
        }}
      />
    </>
  );
};
