/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Alert,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Lock, Person } from "@mui/icons-material";
import AuthLayout from "../../auth/AuthLayout";
import { useTenantLoginMutation } from "../../redux/api/authApi";
import GarageForm from "../../components/form/Form";
import FormInput from "../../components/form/Input";
import { setUser } from "../../redux/feature/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [tenantLogin] = useTenantLoginMutation();
  const dispatch = useDispatch();

  // Show demo account ONLY on app.trustautosolution.com
  const showDemoLogin = useMemo(() => {
    return window.location.hostname === "app.trustautosolution.com";
  }, []);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await tenantLogin(data).unwrap();

      if (res.success) {
        const accessToken = res?.data?.accessToken;
        const user = res?.data?.user;

        dispatch(setUser({ user, token: accessToken }));

        document.cookie = `accessToken=${accessToken}; path=/; domain=.localhost; SameSite=Lax;`;

        toast.success(res.message || "Login successful!");

        const tenantKey = user?.tenantId ? user.domain : "superadmin";
        const isLocalhost = window.location.hostname.includes("localhost");

        const redirectURL =
          tenantKey === "superadmin"
            ? isLocalhost
              ? "http://localhost:5173/dashboard"
              : "https://garage.trustautosolution.com/dashboard/all-tenant-list"
            : isLocalhost
            ? `http://${tenantKey}.localhost:5173/dashboard`
            : `https://${tenantKey}/dashboard`;

        setTimeout(() => {
          window.location.href = redirectURL;
        }, 100);
      } else {
        toast.error(res.message || "Invalid username or password!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed. Please try again.");
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Demo Login
  const handleDemoLogin = () => {
    handleSubmit({
      name: "Trust Auto Solution",
      password: "Auto26!@#trust",
    });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {showDemoLogin && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Demo Account
            </Typography>

            <Typography variant="body2">
              <strong>Username:</strong> Trust Auto Solution
            </Typography>

            <Typography variant="body2" mb={2}>
              <strong>Password:</strong> Auto26!@#trust
            </Typography>

            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleDemoLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login with Demo Account"}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
            >
              Or sign in with your own account below
            </Typography>
          </Box>
        </Alert>
      )}

      <GarageForm onSubmit={handleSubmit}>
        <FormInput
          name="name"
          label="User Name"
          placeholder="User Name"
          required
          icon={Person}
          iconPosition="start"
        />

        <FormInput
          name="password"
          label="User Password"
          placeholder="User Password"
          required
          icon={Lock}
          iconPosition="start"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </GarageForm>
    </AuthLayout>
  );
};

export default Login;