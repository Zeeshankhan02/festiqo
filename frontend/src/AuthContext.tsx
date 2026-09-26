import { createContext, useContext, useState, type ReactNode } from "react";
import type { Role, User } from "./types";
import { sampleUser } from "./mockData";

const demos: Record<Role, User> = {
  student: sampleUser,
  volunteer: {
    ...sampleUser,
    id: "v1",
    name: "Alex Morgan",
    role: "volunteer",
    email: "alex@college.edu",
  },
  admin: {
    ...sampleUser,
    id: "a1",
    name: "Samira Patel",
    role: "admin",
    email: "samira@college.edu",
  },
};
type AuthValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("FestiQO-user") || "null"
      ) as User | null;
    } catch {
      return null;
    }
  });
  const login = (role: Role) => {
    const next = demos[role];
    setUser(next);
    localStorage.setItem("FestiQO-user", JSON.stringify(next));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("FestiQO-user");
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
