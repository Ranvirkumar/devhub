"use client";

import type React from "react";
import type { User } from "@/types";

import {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  login as loginAction,
  logout as logoutAction,
} from "@/lib/slices/authSlice";

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("devhub-user");
    const storedToken = localStorage.getItem("devhub-token");
    if (storedUser && storedUser !== "undefined" && storedToken) {
      dispatch(
        loginAction({ user: JSON.parse(storedUser), token: storedToken })
      );
    }
    setLoading(false);
  }, [dispatch]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        // Mock API call
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const data = await response.json();
        dispatch(loginAction({ user: data.user, token: data.token }));
        localStorage.setItem("devhub-user", JSON.stringify(data.user));
        localStorage.setItem("devhub-token", data.token);

        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${data.user.name}!`,
        });

        router.push("/");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description:
            error instanceof Error ? error.message : "An error occurred",
        });
      }
    },
    [router, toast, dispatch]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        // Mock API call
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        const data = await response.json();
        dispatch(loginAction({ user: data.user, token: data.token }));
        localStorage.setItem("devhub-user", JSON.stringify(data.user));
        localStorage.setItem("devhub-token", data.token);

        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });

        router.push("/");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description:
            error instanceof Error ? error.message : "An error occurred",
        });
      }
    },
    [router, toast, dispatch]
  );

  const signOut = useCallback(() => {
    dispatch(logoutAction());
    localStorage.removeItem("devhub-user");
    localStorage.removeItem("devhub-token");
    router.push("/");

    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  }, [router, toast, dispatch]);

  const contextValue = useMemo(
    () => ({
      user,
      signIn,
      signUp,
      signOut,
      loading,
    }),
    [user, signIn, signUp, signOut, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
