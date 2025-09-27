// frontend/utils/auth.ts
import { api } from "./api";

// Type for the user returned by the backend
export interface User {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  role: "Admin" | "Member";
}

// Login function
export const login = async (
  email: string,
  password: string,
  tenantId: string
): Promise<{ token: string; user: User }> => {
  console.log("Attempting login with:", { email, tenantId });
  const result = await api<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: { email, password, tenantId },
  });
  console.log("Login successful:", result);
  return result;
};

// Logout function
export const logout = () => {
  console.log("Logging out...");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("Local storage cleared");
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Optional: Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? (JSON.parse(storedUser) as User) : null;
};

// Optional: Get JWT token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
