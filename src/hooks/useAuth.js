import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../redux/feature/authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                // If access token expired → try refresh
                if (res.status === 401) {
                    const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
                        method: "POST",
                        credentials: "include",
                    });

                    if (!refreshRes.ok) throw new Error("Refresh token failed");

                    const refreshData = await refreshRes.json();
                    const newToken = refreshData.data.accessToken;
                    dispatch(setUser({ token: newToken }));

                    // Retry /auth/me with new access token
                    res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                }

                const data = await res.json();

                if (!data.success) throw new Error(data.message || "Auth failed");

                dispatch(setUser({ token: data.data.accessToken, user: data.data }));
            } catch (err) {
                console.error("Auth check failed:", err);
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    return { loading };
};
