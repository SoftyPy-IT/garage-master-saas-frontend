/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Alert } from "@mui/material";
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

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await tenantLogin(data).unwrap();

      if (res.success) {
        const accessToken = res?.data?.accessToken;
        const user = res?.data?.user;

        // Redux এ সেট করা
        dispatch(setUser({ user, token: accessToken }));

        // Browser cookie এ token সেট করো যাতে redirect পরেও access থাকে
        document.cookie = `accessToken=${accessToken}; path=/; domain=.localhost; SameSite=Lax;`;

        toast.success(res.message || "Login successful!");

        const tenantKey = user?.tenantDomain || data.tenantDomain;
        const isLocalhost = window.location.hostname.includes("localhost");

        let redirectURL;

        if (tenantKey === "superadmin") {
          redirectURL = isLocalhost
            ? "http://localhost:5173/dashboard"
            : "https://garage.trustautosolution.com/dashboard/all-tenant-list";
        } else {
          redirectURL = isLocalhost
            ? `http://${tenantKey}.localhost:5173/dashboard`
            : `https://${tenantKey}/dashboard`;
        }

        // Redirect করার আগে Redux persist state নিশ্চিতভাবে save হবে
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
          name="tenantDomain"
          label="Domain"
          required
          icon={Person}
          iconPosition="start"
        />
        <FormInput
          name="password"
          label="User password"
          placeholder="User password"
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
