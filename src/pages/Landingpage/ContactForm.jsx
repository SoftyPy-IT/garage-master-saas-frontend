"use client";

import { useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Paper,
  TextField,
  Stack,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import { buttonStyle, inputStyle } from "../../utils/customStyle";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    garageName: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:7000/api/v1/contact",
        formData
      );
      if (res?.data?.success) {
        toast.success("Thank you for contact us. We response soon!"
        );
      } else {
        toast.success(
          res?.data?.message || "Something went wrong! Please try again later."
        );
      }

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        garageName: "",
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: 6,
          background: alpha("#1e293b", 0.5),
          backdropFilter: "blur(20px)",
          border: `2px solid ${alpha("#ffffff", 0.2)}`,
          height: "100%",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#06b6d4" }}
        >
          💬 Send us a Message
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: alpha("#ffffff", 0.8) }}
        >
          Fill out the form below and our team will get back to you within 24
          hours.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              type="email"
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label="Garage Name"
              name="garageName"
              value={formData.garageName}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              sx={inputStyle}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting}
                sx={buttonStyle}
              >
                🚀 {submitting ? "Sending..." : "Send Message"}
              </Button>
            </motion.div>
          </Stack>
        </form>
      </Paper>
    </motion.div>
  );
};

export default ContactForm;
