import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { sampleUser, sampleVolunteer } from "./mockData";
import type { Role, User, Volunteer } from "./types";

type Account = { user: User; password: string; active: boolean };
type VolunteerCreated = { volunteer: Volunteer; password: string };
type AuthValue = {
  user: User | null;
  isAuthenticated: boolean;
  volunteers: Volunteer[];
  login: (role: Role, email: string, password: string) => boolean;
  logout: () => void;
  signupStudent: (email: string, password: string) => User;
  createVolunteer: (email: string) => VolunteerCreated;
  setVolunteerStatus: (id: string, status: Volunteer["status"]) => void;
};

const demos: Account[] = [
  { user: sampleUser, password: "FestStudent@26", active: true },
  {
    user: {
      ...sampleUser,
      id: "v1",
      name: "Alex Morgan",
      email: sampleVolunteer.email,
      role: "volunteer",
    },
    password: "FestVolunteer@26",
    active: true,
  },
  {
    user: {
      ...sampleUser,
      id: "a1",
      name: "admin",
      email: "admin@gmail.com",
      role: "admin",
    },
    password: "FestAdmin@26",
    active: true,
  },
];
const storage = {
  read<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },
};
const emailKey = (email: string) => email.trim().toLowerCase();
function securePassword(accounts: Account[]) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ",
    lower = "abcdefghijkmnopqrstuvwxyz",
    digits = "23456789",
    symbols = "!@#$%&*?";
  const all = upper + lower + digits + symbols;
  const pick = (chars: string) =>
    chars[crypto.getRandomValues(new Uint32Array(1))[0] % chars.length];
  for (;;) {
    const chars = [pick(upper), pick(lower), pick(digits), pick(symbols)];
    while (chars.length < 16) chars.push(pick(all));
    for (let i = chars.length - 1; i > 0; i--) {
      const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    const password = chars.join("");
    if (!accounts.some((account) => account.password === password))
      return password;
  }
}

const AuthContext = createContext<AuthValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    storage.read("FestiQO-user", null)
  );
  const [accounts, setAccounts] = useState<Account[]>(() =>
    storage.read("FestiQO-accounts", demos)
  );
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() =>
    storage.read("FestiQO-volunteers", [sampleVolunteer])
  );
  useEffect(
    () => localStorage.setItem("FestiQO-accounts", JSON.stringify(accounts)),
    [accounts]
  );
  useEffect(
    () =>
      localStorage.setItem("FestiQO-volunteers", JSON.stringify(volunteers)),
    [volunteers]
  );

  const login = (role: Role, email: string, password: string) => {
    const account = accounts.find(
      (entry) =>
        emailKey(entry.user.email) === emailKey(email) &&
        entry.user.role === role &&
        entry.password === password &&
        entry.active
    );
    if (!account) return false;
    setUser(account.user);
    localStorage.setItem("FestiQO-user", JSON.stringify(account.user));
    return true;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("FestiQO-user");
  };
  const signupStudent = (email: string, password: string) => {
    if (
      accounts.some(
        (account) => emailKey(account.user.email) === emailKey(email)
      )
    )
      throw new Error("An account already exists for this email.");
    const localName = email
      .trim()
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    const next: User = {
      id: crypto.randomUUID(),
      name: localName || "Student",
      email: emailKey(email),
      role: "student",
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(
        emailKey(email)
      )}`,
    };
    setAccounts((current) => [
      ...current,
      { user: next, password, active: true },
    ]);
    return next;
  };
  const createVolunteer = (email: string): VolunteerCreated => {
    const normalizedEmail = emailKey(email);
    if (
      accounts.some(
        (account) => emailKey(account.user.email) === normalizedEmail
      )
    )
      throw new Error("An account already exists for this email.");
    const password = securePassword(accounts);
    const id = crypto.randomUUID();
    const name = normalizedEmail
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    const volunteerUser: User = {
      id,
      name: name || "Volunteer",
      email: normalizedEmail,
      role: "volunteer",
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(
        normalizedEmail
      )}`,
    };
    const volunteer: Volunteer = {
      id,
      email: normalizedEmail,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setAccounts((current) => [
      ...current,
      { user: volunteerUser, password, active: true },
    ]);
    setVolunteers((current) => [volunteer, ...current]);
    return { volunteer, password };
  };
  const setVolunteerStatus = (id: string, status: Volunteer["status"]) => {
    setVolunteers((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setAccounts((current) =>
      current.map((item) =>
        item.user.id === id ? { ...item, active: status === "active" } : item
      )
    );
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        volunteers,
        login,
        logout,
        signupStudent,
        createVolunteer,
        setVolunteerStatus,
      }}
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
