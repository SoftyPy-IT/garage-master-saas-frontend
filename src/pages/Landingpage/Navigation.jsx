/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
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
} from "@mui/material"
import { Menu as MenuIcon, Close as CloseIcon, AutoFixHigh } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"



export const Navigation = ({ scrollToSection }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { label: "Features", id: "features" },
    { label: "Workflow", id: "workflow" },
    { label: "Pricing", id: "pricing" },
    { label: "Clients", id: "clients" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Consultancy", id: "consultancy" },
    { label: "Contact", id: "contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId)
    setIsMenuOpen(false)
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? alpha("#0f172a", 0.95) : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${alpha("#334155", 0.3)}` : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
            <motion.div
              whileHover={{
                rotate: [0, -10, 10, -10, 0],
                scale: 1.1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 32px ${alpha("#06b6d4", 0.3)}`,
                }}
              >
                <AutoFixHigh sx={{ color: "white", fontSize: 24 }} />
              </Box>
            </motion.div>
            <Typography variant="h5" component="div" sx={{ fontWeight: 900, letterSpacing: "-1px", color: "#fff" }}>
              Garage Master
            </Typography>
           
          </Stack>

          {!isMobile ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {navItems.map((item) => (
                <motion.div key={item.id} whileHover={{ y: -2 }}>
                  <Button
                    color="inherit"
                    onClick={() => handleNavClick(item.id)}
                    sx={{
                      fontWeight: 700,
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      color: alpha("#ffffff", 0.8),
                      "&:hover": {
                        background: `linear-gradient(135deg, ${alpha("#06b6d4", 0.1)} 0%, ${alpha("#3b82f6", 0.1)} 100%)`,
                        color: "#ffffff",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/login"
                  sx={{
                    borderWidth: 2,
                    borderColor: "#06b6d4",
                    color: "#06b6d4",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    "&:hover": {
                      borderWidth: 2,
                      background: alpha("#06b6d4", 0.1),
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${alpha("#06b6d4", 0.3)}`,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: `0 8px 32px ${alpha("#06b6d4", 0.4)}`,
                    "&:hover": {
                      background: "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
                      transform: "translateY(-3px)",
                      boxShadow: `0 12px 40px ${alpha("#06b6d4", 0.5)}`,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  🚀 Start Free Trial
                </Button>
              </motion.div>
            </Stack>
          ) : (
            <IconButton color="inherit" onClick={() => setIsMenuOpen(true)}>
              <MenuIcon className="text-white"/>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: 300,
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            color: "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Menu
          </Typography>
          <IconButton color="inherit" onClick={() => setIsMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: alpha("#ffffff", 0.2) }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.id} onClick={() => handleNavClick(item.id)} sx={{ cursor: "pointer" }}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, mt: "auto" }}>
          <Button component={Link} to="/login" fullWidth color="inherit" sx={{ mb: 1 }}>
            Login
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              background: "#ffffff",
              color: "#06b6d4",
              "&:hover": { background: alpha("#ffffff", 0.9) },
            }}
          >
            Start Free Trial
          </Button>
        </Box>
      </Drawer>
    </>
  )
}
