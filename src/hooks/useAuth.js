// src/hooks/useAuth.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/feature/authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();

    useEffect(() => {

        fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (res) => {

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    console.error("[useAuth] Fetch error:", errData);
                    return null;
                }

                return res.json();
            })
            .then((data) => {
                if (data?.success && data?.data) {
                    dispatch(setUser({ user: data.data, token: data.data.accessToken }));
                }


            })
            .catch((err) => {
                console.error("[useAuth] Fetch failed:", err);
            });
    }, [dispatch]);
};
