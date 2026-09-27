import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import QRCode from "react-qr-code";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  Music2,
  Plus,
  QrCode,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  events,
  notices,
  ranks,
  sampleEvent,
  sampleQuiz,
  sampleRegistration,
  sampleUser,
} from "./mockData";
import type { Event, Role, User } from "./types";
import LandingPage from "./LandingPage";
import ThemeToggle from "./ThemeToggle";
import { getTicketScanStatus, type TicketScanStatus } from "./ticketValidation";
import { useAuth } from "./AuthContext";
import { CertificatesPage, VolunteersPage } from "./AdminManagement";

type AppUser = User;
const navByRole: Record<
  Role,
  { label: string; path: string; icon: typeof Compass }[]
> = {
  student: [
    { label: "Overview", path: "/student", icon: LayoutDashboard },
    { label: "Explore events", path: "/student/events", icon: Compass },
    { label: "My tickets", path: "/student/tickets", icon: Ticket },
    { label: "Quizzes", path: "/student/quizzes", icon: CircleHelp },
    { label: "Leaderboard", path: "/student/leaderboard", icon: Trophy },
    { label: "Notifications", path: "/student/notifications", icon: Bell },
  ],
  volunteer: [
    { label: "Shift overview", path: "/volunteer", icon: LayoutDashboard },
    { label: "Entry scanner", path: "/volunteer/scanner", icon: ScanLine },
    { label: "Scan history", path: "/volunteer/logs", icon: FileText },
  ],
  admin: [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Events", path: "/admin/events", icon: CalendarDays },
    { label: "Participants", path: "/admin/participants", icon: Users },
    { label: "Quizzes", path: "/admin/quizzes", icon: CircleHelp },
    { label: "Volunteers", path: "/admin/volunteers", icon: Users },
    { label: "Certificates", path: "/admin/certificates", icon: FileText },
    { label: "Announcements", path: "/admin/notifications", icon: Bell },
  ],
};

function App() {
  const { user, login, logout } = useAuth();
  const [notice, setNotice] = useState("");
  const toast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login user={user} onLogin={login} />} />
        <Route path="/signup" element={<SignupPage user={user} />} />
        <Route
          path="/unauthorized"
          element={
            <div className="not-found">
              <ShieldCheck />
              <h1>That area is restricted</h1>
              <p>Your account doesn’t have access to this workspace.</p>
              <Link to="/">
                Go home <ArrowRight size={16} />
              </Link>
            </div>
          }
        />
        <Route
          path="/"
          element={
            <LandingPage dashboardPath={user ? `/${user.role}` : undefined} />
          }
        />
        {(["student", "volunteer", "admin"] as Role[]).map((role) => (
          <Route
            key={role}
            path={`/${role}/*`}
            element={
              <Protected user={user} role={role}>
                <Workspace user={user!} onLogout={logout} toast={toast} />
              </Protected>
            }
          />
        ))}
        <Route
          path="*"
          element={<Navigate to={user ? `/${user.role}` : "/login"} replace />}
        />
      </Routes>
      {notice && (
        <div className="toast">
          <span className="toast-check">
            <Check size={15} />
          </span>
          {notice}
        </div>
      )}
    </>
  );
}

function Protected({
  user,
  role,
  children,
}: {
  user: AppUser | null;
  role: Role;
  children: React.ReactNode;
}) {
  return !user ? (
    <Navigate to="/login" replace />
  ) : user.role !== role ? (
    <Navigate to="/unauthorized" replace />
  ) : (
    <>{children}</>
  );
}

function Login({
  user,
  onLogin,
}: {
  user: AppUser | null;
  onLogin: (role: Role, email: string, password: string) => boolean;
}) {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (user) navigate(`/${user.role}`);
  }, [user, navigate]);
  return (
    <div className="login-page">
      <div className="login-side">
        <div className="brand brand-light">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          FestiQO
        </div>
        <div className="login-promo">
          <div className="eyebrow light-eyebrow">
            <i /> CAMPUS, IN MOTION
          </div>
          <h1>
            Make this
            <br />
            one <em>unforgettable.</em>
          </h1>
          <p>
            One place for every big moment at your fest. Discover, show up, make
            your mark.
          </p>
          <div className="login-date">
            <CalendarDays size={17} /> OCT 15 — 17, 2026 <span /> YUKTI
          </div>
        </div>
        <div className="promo-foot">
          <div className="avatar-stack">
            <img src="https://i.pravatar.cc/80?img=11" />
            <img src="https://i.pravatar.cc/80?img=32" />
            <img src="https://i.pravatar.cc/80?img=12" />
            <b>+2.4k</b>
          </div>
          <span>students are already in</span>
        </div>
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </div>
      <div className="login-main">
        <div className="login-theme-toggle">
          <ThemeToggle compact />
        </div>
        <div className="mobile-brand brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          FestiQO
        </div>
        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setSubmitting(true);
            window.setTimeout(() => {
              const valid = onLogin(role, email, password);
              if (!valid)
                setError(
                  "We couldn’t find an active account with those details and role."
                );
              setSubmitting(false);
            }, 250);
          }}
        >
          <div className="eyebrow">WELCOME TO YOUR FEST</div>
          <h2>
            Pick up where the
            <br />
            energy is.
          </h2>
          <p>Choose how you’d like to enter the platform.</p>
          <label className="auth-field">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@college.edu"
            />
          </label>
          <label className="auth-field">
            Password
            <span className="auth-password">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <div
            className="role-picker"
            role="group"
            aria-label="Choose a demo role"
          >
            {(["student", "volunteer", "admin"] as Role[]).map((item) => (
              <button
                key={item}
                type="button"
                className={role === item ? "selected" : ""}
                onClick={() => setRole(item)}
              >
                <span className="role-icon">
                  {item === "student" ? (
                    <Compass size={17} />
                  ) : item === "volunteer" ? (
                    <ScanLine size={17} />
                  ) : (
                    <Settings size={17} />
                  )}
                </span>
                <span>
                  <b>{item[0].toUpperCase() + item.slice(1)}</b>
                </span>
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary btn-wide"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Signing in…" : `Continue as ${role}`}
            <ArrowRight size={17} />
          </button>
          <div className="login-terms signup-prompt">
            New to FestiQO? <Link to="/signup">Create a student account</Link>
          </div>
        </form>
        <div className="login-help">
          <CircleHelp size={15} /> Need a hand?{" "}
          <a href="mailto:hello@FestiQO.campus">Get in touch</a>
        </div>
      </div>
    </div>
  );
}

function SignupPage({ user }: { user: AppUser | null }) {
  const navigate = useNavigate();
  const { signupStudent } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (user) navigate(`/${user.role}`);
  }, [user, navigate]);
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const next: typeof fieldErrors = {};
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter a password.";
    else if (password.length < 8) next.password = "Use at least 8 characters.";
    if (!confirmPassword) next.confirmPassword = "Confirm your password.";
    else if (password !== confirmPassword)
      next.confirmPassword = "Passwords don’t match.";
    setFieldErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    window.setTimeout(() => {
      try {
        signupStudent(email, password);
        setSuccess(true);
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "We couldn’t create your account. Try again."
        );
      } finally {
        setLoading(false);
      }
    }, 350);
  };
  return (
    <div className="login-page">
      <div className="login-side">
        <div className="brand brand-light">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          FestiQO
        </div>
        <div className="login-promo">
          <div className="eyebrow light-eyebrow">
            <i /> STUDENTS, THIS ONE’S YOURS
          </div>
          <h1>
            Find your
            <br />
            people <em>here.</em>
          </h1>
          <p>
            Create your student account and keep every event, ticket, and fest
            moment together.
          </p>
        </div>
        <div className="promo-foot">YUKTI · OCTOBER 15—17, 2026</div>
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </div>
      <div className="login-main">
        <div className="login-theme-toggle">
          <ThemeToggle compact />
        </div>
        <Link to="/" className="mobile-brand brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          FestiQO
        </Link>
        {success ? (
          <div className="login-form auth-success">
            <span className="auth-success-mark">
              <Check size={22} />
            </span>
            <div className="eyebrow">YOU’RE ON THE LIST</div>
            <h2>
              Your student account
              <br />
              is ready.
            </h2>
            <p>Sign in with the email and password you just created.</p>
            <Link className="btn btn-primary btn-wide" to="/login">
              Go to login <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <form className="login-form signup-form" onSubmit={submit} noValidate>
            <div className="eyebrow">JOIN THE FEST</div>
            <h2>
              Create your
              <br />
              student account.
            </h2>
            <p>Just the basics. The good stuff starts after.</p>
            <label className="auth-field">
              Email
              <input
                type="email"
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@college.edu"
              />
              {fieldErrors.email && (
                <small className="auth-error">{fieldErrors.email}</small>
              )}
            </label>
            <label className="auth-field">
              Password
              <span className="auth-password">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.password}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
              {fieldErrors.password && (
                <small className="auth-error">{fieldErrors.password}</small>
              )}
            </label>
            <label className="auth-field">
              Confirm password
              <span className="auth-password">
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.confirmPassword}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  placeholder="Enter your password again"
                />
                <button
                  type="button"
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirm((value) => !value)}
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
              {fieldErrors.confirmPassword && (
                <small className="auth-error">
                  {fieldErrors.confirmPassword}
                </small>
              )}
            </label>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="btn btn-primary btn-wide"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create student account"}
              <ArrowRight size={17} />
            </button>
            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        )}
        <div className="login-help">
          <CircleHelp size={15} /> Need a hand?{" "}
          <a href="mailto:hello@FestiQO.campus">Get in touch</a>
        </div>
      </div>
    </div>
  );
}

function Workspace({
  user,
  onLogout,
  toast,
}: {
  user: AppUser;
  onLogout: () => void;
  toast: (s: string) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = navByRole[user.role];
  const base = `/${user.role}`;
  const title =
    nav.find((n) => location.pathname === n.path)?.label || nav[0].label;
  return (
    <div className={`app-shell role-${user.role}`}>
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <Link className="brand" to={base}>
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          FestiQO<span className="brand-beta">2026</span>
        </Link>
        <div className="workspace-switch">
          <div className="workspace-symbol">
            <Flame size={17} />
          </div>
          <div>
            <b>YUKTI</b>
            <small>Annual Fest · 2026</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path ||
              (item.path !== base && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={active ? "active" : ""}
              >
                <Icon size={18} />
                {item.label}
                {item.label === "My tickets" && (
                  <span className="nav-count">1</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="side-bottom">
          <div className="side-label">YOUR FEST</div>
          <button onClick={() => toast("Help center is ready for you")}>
            <CircleHelp size={18} />
            Help center
            <ExternalLink size={13} className="external" />
          </button>
          <div className="side-user">
            <img src={user.avatar} />
            <span>
              <b>{user.name}</b>
              <small>
                {user.role === "admin"
                  ? "Fest organizer"
                  : user.role === "volunteer"
                  ? "Volunteer team"
                  : "Student account"}
              </small>
            </span>
            <button aria-label="Sign out" onClick={onLogout}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="mobile-scrim"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>
          <div className="crumb">
            FestiQO <span>/</span> <b>{title}</b>
          </div>
          <div className="top-actions">
            <ThemeToggle compact />
            <button
              className="icon-button top-search"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={18} />
            </button>
            <button
              className="icon-button notification-trigger"
              aria-label="Notifications"
              onClick={() =>
                navigate(
                  user.role === "admin"
                    ? "/admin/notifications"
                    : `/${user.role}/notifications`
                )
              }
            >
              <Bell size={18} />
              <i />
            </button>
            <span className="top-divider" />
            <button
              className="role-switch"
              title="Switch demo role"
              onClick={() => onLogout()}
            >
              <img src={user.avatar} />
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        {searchOpen && (
          <div className="quick-search">
            <Search size={17} />
            <input
              autoFocus
              placeholder="Search events, tickets, quizzes…"
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
            />
            <kbd>ESC</kbd>
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard user={user} toast={toast} />} />
            <Route
              path="/events"
              element={
                user.role === "student" ? (
                  <EventsPage toast={toast} />
                ) : (
                  <AdminEvents toast={toast} />
                )
              }
            />
            <Route path="/events/:id" element={<EventDetail toast={toast} />} />
            <Route path="/tickets" element={<TicketsPage toast={toast} />} />
            <Route
              path="/quizzes"
              element={
                user.role === "admin" ? (
                  <QuizBuilder toast={toast} />
                ) : (
                  <QuizzesPage toast={toast} />
                )
              }
            />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/scanner" element={<ScannerPage toast={toast} />} />
            <Route path="/logs" element={<ScanLogs />} />
            <Route path="/participants" element={<Participants />} />
            <Route
              path="/volunteers"
              element={
                user.role === "admin" ? (
                  <VolunteersPage toast={toast} />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              }
            />
            <Route
              path="/certificates"
              element={
                user.role === "admin" ? (
                  <CertificatesPage toast={toast} />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              }
            />
            <Route
              path="/notifications"
              element={
                user.role === "admin" ? (
                  <Announcement toast={toast} />
                ) : (
                  <NotificationCenter />
                )
              }
            />
            <Route path="*" element={<Dashboard user={user} toast={toast} />} />
          </Routes>
        </div>
      </main>
      <MobileNav nav={nav} path={location.pathname} />
    </div>
  );
}

function MobileNav({
  nav,
  path,
}: {
  nav: (typeof navByRole)[Role];
  path: string;
}) {
  return (
    <nav className="mobile-nav">
      {nav
        .filter((n) => n.label !== "Leaderboard" && n.label !== "Notifications")
        .slice(0, 4)
        .map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.path}
              to={n.path}
              className={path === n.path ? "active" : ""}
            >
              <Icon size={19} />
              <small>{n.label.split(" ")[0]}</small>
            </Link>
          );
        })}
    </nav>
  );
}

function Dashboard({
  user,
  toast,
}: {
  user: AppUser;
  toast: (s: string) => void;
}) {
  if (user.role === "volunteer") return <VolunteerDashboard />;
  if (user.role === "admin") return <AdminDashboard toast={toast} />;
  return <StudentDashboard toast={toast} />;
}

function PageHead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="head-action">{action}</div>}
    </div>
  );
}

function StudentDashboard({ toast }: { toast: (s: string) => void }) {
  const [filter, setFilter] = useState("All events");
  const shown = useMemo(
    () =>
      events.filter((e) => filter === "All events" || e.category === filter),
    [filter]
  );
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <div className="eyebrow hero-eyebrow">
            <i /> YUKTI PRESENTS
          </div>
          <h1>
            Where ideas
            <br />
            meet <em>energy.</em>
          </h1>
          <p>
            Three days of big ideas, new faces and moments that stay with you.
            Your fest starts here.
          </p>
          <div className="hero-buttons">
            <Link className="btn btn-white" to="/student/events">
              Explore events <ArrowRight size={16} />
            </Link>
            <Link className="btn btn-glass" to="/student/tickets">
              My tickets <Ticket size={16} />
            </Link>
          </div>
          <div className="hero-meta">
            <span>
              <CalendarDays size={15} /> OCT 15 — 17, 2026
            </span>
            <span className="meta-divider" />
            <span>
              <Users size={15} /> 2,400+ joining
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-photo" />
          <div className="hero-chip chip-top">
            <span className="live-dot" /> 3 DAYS OF WHAT’S NEXT
          </div>
          <div className="hero-sticker">
            <span>
              THINK
              <br />
              BIG.
            </span>
            <Sparkles size={20} />
          </div>
          <div className="hero-chip chip-bottom">
            <span className="chip-icon">
              <Music2 size={14} />
            </span>
            TECH · MUSIC · CULTURE
          </div>
        </div>
      </section>
      <section className="stats-row">
        <Stat
          label="Your registrations"
          value="01"
          detail="One event on your list"
          icon={<Ticket size={18} />}
          tone="lavender"
        />
        <Stat
          label="Fest starts in"
          value="19 days"
          detail="Thursday, October 15"
          icon={<Clock3 size={18} />}
          tone="peach"
        />
        <Stat
          label="Your quiz rank"
          value="#04"
          detail="Up 2 places this week"
          icon={<Trophy size={18} />}
          tone="mint"
        />
      </section>
      <section className="content-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">FIND YOUR THING</div>
            <h2>Made for your kind of curious.</h2>
            <p>Pick a lane or let the day surprise you.</p>
          </div>
          <Link className="text-link" to="/student/events">
            All events <ArrowRight size={16} />
          </Link>
        </div>
        <div className="filter-row">
          {["All events", "Technical", "Music", "Creative"].map((x) => (
            <button
              className={`filter-pill ${x === filter ? "selected" : ""}`}
              key={x}
              onClick={() => setFilter(x)}
            >
              {x === "Music" ? (
                <Music2 size={14} />
              ) : x === "Technical" ? (
                <Activity size={14} />
              ) : null}
              {x}
            </button>
          ))}
        </div>
        <div className="event-grid">
          {shown.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
      <section className="bottom-grid">
        <div className="next-event-card">
          <div className="next-label">
            <span className="live-dot purple-dot" /> NEXT UP FOR YOU
          </div>
          <div className="next-body">
            <div>
              <span className="category-tag">{sampleEvent.category}</span>
              <h3>{sampleEvent.title}</h3>
              <p>Team ByteBusters · Registration confirmed</p>
              <div className="next-details">
                <span>
                  <CalendarDays size={14} /> Oct 15, 9:00 AM
                </span>
                <span>
                  <Ticket size={14} /> {sampleRegistration.ticketId}
                </span>
              </div>
            </div>
            <Link to="/student/tickets" className="btn btn-dark">
              Open ticket <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="mini-notice">
          <div className="mini-notice-top">
            <span className="eyebrow">IN THE LOOP</span>
            <button
              className="icon-button"
              onClick={() => toast("No new announcements")}
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <h3>Quiz Results Out</h3>
          <p>
            Results for Tech Trivia just landed. You’re sitting at <b>#4</b> on
            the leaderboard.
          </p>
          <span className="notice-time">
            <span className="notice-dot" /> 2 hours ago
          </span>
        </div>
      </section>
    </>
  );
}
function Stat({
  label,
  value,
  detail,
  icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <span className={`stat-icon ${tone}`}>{icon}</span>
      <span className="stat-label">{label}</span>
      <b className="stat-value">{value}</b>
      <small>{detail}</small>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <article className="event-card">
      <Link
        to={`/student/events/${event.id}`}
        className="event-image"
        style={{ backgroundImage: `url(${event.image})` }}
      >
        <span className="category-tag">{event.category}</span>
        <button className="event-save" aria-label="Save event">
          <Sparkles size={15} />
        </button>
      </Link>
      <div className="event-info">
        <div className="event-title-row">
          <Link to={`/student/events/${event.id}`}>
            <h3>{event.title}</h3>
          </Link>
          <span className="event-arrow">
            <ArrowUpRight size={16} />
          </span>
        </div>
        <p>{event.description}</p>
        <div className="event-where">
          <span>
            <CalendarDays size={14} />
            {new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            · {event.time}
          </span>
          <span>
            <Compass size={14} />
            {event.venue}
          </span>
        </div>
        <div className="event-footer">
          <span className="capacity">
            <span className="capacity-bar">
              <i
                style={{
                  width: `${(event.registered / event.maxParticipants) * 100}%`,
                }}
              />
            </span>
            {event.registered} / {event.maxParticipants} spots
          </span>
          <Link to={`/student/events/${event.id}`} className="small-link">
            View event <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EventsPage({ toast }: { toast: (s: string) => void }) {
  const [cat, setCat] = useState("All events");
  const [q, setQ] = useState("");
  const found = events.filter(
    (e) =>
      (cat === "All events" || e.category === cat) &&
      e.title.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <>
      <PageHead
        eyebrow="THE FULL LINEUP"
        title="Explore events"
        description="Find the thing you’ll be talking about next week."
        action={
          <button
            className="btn btn-dark"
            onClick={() => toast("Event calendar downloaded")}
          >
            <Download size={16} /> Calendar
          </button>
        }
      />
      <div className="events-tools">
        <div className="inline-search">
          <Search size={17} />
          <input
            placeholder="Search events"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="filter-row">
          {["All events", "Technical", "Music", "Creative"].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`filter-pill ${cat === c ? "selected" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="event-grid">
        {found.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
      {!found.length && (
        <Empty
          icon={<Compass />}
          title="No events found"
          text="Try a different event name or category."
        />
      )}
    </>
  );
}

function EventDetail({ toast }: { toast: (s: string) => void }) {
  const event =
    events.find((e) => e.id === window.location.pathname.split("/").pop()) ||
    sampleEvent;
  return (
    <>
      <Link to="/student/events" className="back-link">
        ← All events
      </Link>
      <div
        className="detail-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(14,22,35,.88),rgba(14,22,35,.1)),url(${event.image})`,
        }}
      >
        <span className="category-tag">{event.category}</span>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <h2>About this event</h2>
          <p className="body-copy">
            Bring your curiosity, your favorite people, and an open mind. This
            is a space to make something, meet someone, and leave with a story
            worth sharing. All experience levels are welcome.
          </p>
          <h3>What to expect</h3>
          <div className="expect-grid">
            <span>
              <Sparkles /> Hands-on experiences
            </span>
            <span>
              <Users /> Meet your people
            </span>
            <span>
              <Trophy /> Prizes & bragging rights
            </span>
          </div>
        </div>
        <aside className="register-card">
          <span className="eyebrow">SAVE YOUR SPOT</span>
          <h3>Everything you need to know.</h3>
          <p>
            <CalendarDays />
            {new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {event.time}
          </p>
          <p>
            <Compass />
            {event.venue}
          </p>
          <p>
            <Users />
            {event.registered} of {event.maxParticipants} spots filled
          </p>
          <button
            className="btn btn-dark btn-wide"
            onClick={() => toast("You’re registered for " + event.title + "!")}
          >
            Register for free <ArrowRight size={16} />
          </button>
          <small>No payment required · Limited spots available</small>
        </aside>
      </div>
    </>
  );
}

function TicketsPage({ toast }: { toast: (s: string) => void }) {
  return (
    <>
      <PageHead
        eyebrow="YOUR WRISTBAND, DIGITALLY"
        title="My tickets"
        description="Everything you need to get through the door, right here."
      />
      <div className="ticket-layout">
        <div className="ticket-card">
          <div className="ticket-main">
            <div className="ticket-head">
              <span className="category-tag">TECHNICAL · TEAM EVENT</span>
              <span className="status-badge">
                <i /> CONFIRMED
              </span>
            </div>
            <h2>{sampleEvent.title}</h2>
            <p className="ticket-sub">
              A 24-hour hackathon for the curious, the builders, and the big
              thinkers.
            </p>
            <div className="ticket-details">
              <div>
                <span>DATE & TIME</span>
                <b>OCT 15, 2026 · 09:00 AM</b>
              </div>
              <div>
                <span>VENUE</span>
                <b>MAIN AUDITORIUM</b>
              </div>
              <div>
                <span>PARTICIPANT</span>
                <b>Rahul Sharma</b>
              </div>
              <div>
                <span>TEAM</span>
                <b>ByteBusters · 2 members</b>
              </div>
            </div>
          </div>
          <div className="ticket-stub">
            <div className="perforation" />
            <div className="qr-box">
              <QRCode
                value={sampleRegistration.ticketId}
                size={138}
                bgColor="#fff"
                fgColor="#171c27"
              />
            </div>
            <span className="ticket-number">{sampleRegistration.ticketId}</span>
            <small>Present this QR at the entrance</small>
          </div>
          <div className="ticket-notch top" />
          <div className="ticket-notch bottom" />
        </div>
        <div className="ticket-actions">
          <button
            className="btn btn-dark"
            onClick={() => toast("Ticket saved to your device")}
          >
            <Download size={16} /> Download ticket
          </button>
          <button
            className="btn btn-outline"
            onClick={() => toast("Ticket link copied")}
          >
            <ExternalLink size={16} /> Share ticket
          </button>
        </div>
        <div className="ticket-help">
          <ShieldCheck size={17} />
          <span>
            <b>Keep your ticket close.</b> This QR code is unique to you and can
            only be scanned once at entry.
          </span>
        </div>
      </div>
    </>
  );
}

function QuizzesPage({ toast }: { toast: (s: string) => void }) {
  const [started, setStarted] = useState(false);
  const [q, setQ] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(sampleQuiz.duration);
  useEffect(() => {
    if (!started) return;
    const t = window.setInterval(
      () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => window.clearInterval(t);
  }, [started]);
  useEffect(() => {
    if (seconds === 0 && started) {
      setStarted(false);
      toast("Quiz submitted · Your results are on their way!");
    }
  }, [seconds, started, toast]);
  const question = sampleQuiz.questions[q];
  return (
    <>
      <PageHead
        eyebrow="PUT YOUR BRAIN IN THE GAME"
        title="Quizzes"
        description="Quick rounds, good bragging rights. See what you know."
      />
      <div className="quiz-feature">
        <div className="quiz-cover">
          <div className="quiz-orbit orbit-a" />
          <div className="quiz-orbit orbit-b" />
          <div className="quiz-cover-content">
            <span className="quiz-badge">
              <Sparkles size={14} /> LIVE QUIZ
            </span>
            <div className="quiz-big-icon">
              <CircleHelp size={33} />
            </div>
            <span className="quiz-cover-note">01 / 03 · ROUND ONE</span>
          </div>
          <div className="quiz-spark">✳</div>
        </div>
        <div className="quiz-content">
          <div className="quiz-meta">
            <span>GENERAL KNOWLEDGE</span>
            <span>·</span>
            <span>
              <Clock3 size={13} /> 1 MIN
            </span>
            <span>·</span>
            <span>10 QUESTIONS</span>
          </div>
          <h2>{sampleQuiz.title}</h2>
          <p>
            From the latest in tech to the classics you should know. A little
            friendly competition never hurt.
          </p>
          {started ? (
            <div className="quiz-question">
              <div className="quiz-progress">
                <span>
                  QUESTION {q + 1} OF {sampleQuiz.questions.length}
                </span>
                <b className={seconds < 15 ? "timer-warning" : ""}>
                  <Clock3 size={14} /> 00:{String(seconds).padStart(2, "0")}
                </b>
              </div>
              <div className="progress-track">
                <i
                  style={{
                    width: `${((q + 1) / sampleQuiz.questions.length) * 100}%`,
                  }}
                />
              </div>
              <h3>{question.text}</h3>
              <div className="answer-options">
                {question.options.map((o, i) => (
                  <button
                    key={o}
                    className={answer === i ? "chosen" : ""}
                    onClick={() => setAnswer(i)}
                  >
                    <span>{String.fromCharCode(65 + i)}</span>
                    {o}
                    {answer === i && <Check size={15} />}
                  </button>
                ))}
              </div>
              <div className="question-actions">
                <button
                  className="btn btn-outline"
                  disabled={q === 0}
                  onClick={() => {
                    setQ(Math.max(0, q - 1));
                    setAnswer(null);
                  }}
                >
                  Previous
                </button>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    if (q < sampleQuiz.questions.length - 1) {
                      setQ(q + 1);
                      setAnswer(null);
                    } else {
                      setStarted(false);
                      toast("Quiz submitted · Your results are on their way!");
                    }
                  }}
                >
                  {q === sampleQuiz.questions.length - 1
                    ? "Submit quiz"
                    : "Next question"}{" "}
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-dark"
              onClick={() => {
                setStarted(true);
                setSeconds(sampleQuiz.duration);
                setQ(0);
                setAnswer(null);
              }}
            >
              Start the quiz <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="quiz-bottom">
        <div>
          <span className="eyebrow">YOUR BEST SO FAR</span>
          <b>
            Tech Trivia <span className="text-purple">·</span> 8 / 10
          </b>
          <small>Completed Sep 19, 2026</small>
        </div>
        <div className="quiz-score">
          <Trophy />
          <b>#4</b>
          <small>on the leaderboard</small>
        </div>
      </div>
    </>
  );
}

function LeaderboardPage() {
  return (
    <>
      <PageHead
        eyebrow="FRIENDLY COMPETITION"
        title="Leaderboard"
        description="A little healthy competition never hurt. Keep climbing."
        action={
          <button className="btn btn-outline">
            <CalendarDays size={15} /> This week <ChevronDown size={14} />
          </button>
        }
      />
      <div className="leaderboard-shell">
        <div className="podium">
          <Podium
            user="Maya Kapoor"
            score="1,840"
            place={2}
            img="https://i.pravatar.cc/100?img=47"
          />
          <Podium
            user="Rahul Sharma"
            score="2,120"
            place={1}
            img={sampleUser.avatar}
          />
          <Podium
            user="Aarav Mehta"
            score="1,660"
            place={3}
            img="https://i.pravatar.cc/100?img=12"
          />
        </div>
        <div className="rank-table">
          <div className="rank-header">
            <span>RANK</span>
            <span>PARTICIPANT</span>
            <span>SCORE</span>
            <span>TIME</span>
            <span>TREND</span>
          </div>
          {[
            ...ranks,
            ...[
              { rank: 5, userName: "Priya Nair", score: 78, timeTaken: "31s" },
            ],
          ].map((r, i) => (
            <div
              className={`rank-row ${
                r.userName === "Rahul Sharma" ? "you" : ""
              }`}
              key={r.rank}
            >
              <b className="rank-num">{String(r.rank).padStart(2, "0")}</b>
              <div className="rank-person">
                <img
                  src={
                    r.userName === "Rahul Sharma"
                      ? sampleUser.avatar
                      : `https://i.pravatar.cc/80?img=${20 + i * 3}`
                  }
                />
                <b>
                  {r.userName}
                  {r.userName === "Rahul Sharma" && <small>YOU</small>}
                </b>
              </div>
              <b className="rank-score">
                {r.score.toLocaleString()} <small>pts</small>
              </b>
              <span className="rank-time">{r.timeTaken}</span>
              <span className="rank-trend">
                {i < 3 ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="leader-foot">
          <span>
            <span className="live-dot" /> Updated just now
          </span>
          <span>Scoring resets in 4 days</span>
        </div>
      </div>
    </>
  );
}
function Podium({
  user,
  score,
  place,
  img,
}: {
  user: string;
  score: string;
  place: number;
  img: string;
}) {
  return (
    <div className={`podium-person place-${place}`}>
      <div className="podium-avatar">
        <img src={img} />
        {place === 1 && <span>✦</span>}
      </div>
      <b>{user}</b>
      <small>{score} pts</small>
      <div className="podium-step">
        <span>{place === 1 ? "1ST" : place === 2 ? "2ND" : "3RD"}</span>
      </div>
    </div>
  );
}

function VolunteerDashboard() {
  return (
    <>
      <div className="vol-banner">
        <div>
          <div className="eyebrow vol-eyebrow">
            <i /> LIVE SHIFT · EAST ENTRY
          </div>
          <h1>
            You’re on the
            <br />
            <em>front line.</em>
          </h1>
          <p>
            Doors open in 42 minutes. Let’s make every arrival feel like the
            start of something.
          </p>
          <Link className="btn btn-white" to="/volunteer/scanner">
            Open scanner <ScanLine size={16} />
          </Link>
        </div>
        <div className="vol-illustration">
          <div className="scan-ring">
            <ScanLine size={70} />
            <span />
          </div>
          <div className="vol-glow" />
        </div>
      </div>
      <div className="vol-stats">
        <Stat
          label="Checked in"
          value="128"
          detail="of 240 expected guests"
          icon={<Check />}
          tone="mint"
        />
        <Stat
          label="Scan rate"
          value="82%"
          detail="+12% from last event"
          icon={<Activity />}
          tone="lavender"
        />
        <Stat
          label="Shift ends"
          value="2:30 PM"
          detail="1h 48m remaining"
          icon={<Clock3 />}
          tone="peach"
        />
      </div>
      <div className="vol-grid">
        <div className="vol-shift-card">
          <div className="section-kicker">YOUR ASSIGNMENT</div>
          <h2>CodeSprint 2026</h2>
          <p>
            <CalendarDays /> Today, Oct 15 · 08:00 AM – 02:30 PM
          </p>
          <p>
            <Compass /> East Entry · Main Auditorium
          </p>
          <div className="shift-progress">
            <span>ENTRY PROGRESS</span>
            <b>128 / 240</b>
            <i>
              <em />
            </i>
          </div>
          <Link to="/volunteer/scanner" className="text-link">
            Start scanning <ArrowRight size={15} />
          </Link>
        </div>
        <div className="vol-recent">
          <div className="section-kicker">
            RECENT CHECK-INS{" "}
            <Link to="/volunteer/logs">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ScanLogItem
            name="Priya Nair"
            team="Pixel Pioneers"
            time="09:47 AM"
            status="Checked in"
          />
          <ScanLogItem
            name="Dev Khanna"
            team="Solo entry"
            time="09:44 AM"
            status="Checked in"
          />
          <ScanLogItem
            name="Rhea Joshi"
            team="ByteBusters"
            time="09:39 AM"
            status="Checked in"
          />
        </div>
      </div>
    </>
  );
}
function ScanLogItem({
  name,
  team,
  time,
  status,
}: {
  name: string;
  team: string;
  time: string;
  status: string;
}) {
  return (
    <div className="scan-log">
      <span className="scan-log-check">
        <Check size={14} />
      </span>
      <span>
        <b>{name}</b>
        <small>{team}</small>
      </span>
      <span className="scan-log-time">{time}</span>
      <span className="scan-ok">{status}</span>
    </div>
  );
}

function ScannerPage({ toast }: { toast: (s: string) => void }) {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [result, setResult] = useState<{
    ticketId: string;
    status: TicketScanStatus;
  } | null>(null);
  const scannedTicketIds = useRef(new Set<string>());
  const verifyTicket = (rawTicketId: string) => {
    const ticketId = rawTicketId.trim().toUpperCase();
    const status = getTicketScanStatus(
      ticketId,
      sampleRegistration.ticketId,
      scannedTicketIds.current.has(ticketId)
    );
    if (status === "valid") scannedTicketIds.current.add(ticketId);
    setResult({ ticketId, status });
    setScanning(false);
    toast(
      status === "valid"
        ? "Entry verified · Welcome to CodeSprint!"
        : status === "duplicate"
        ? "Entry blocked · This ticket was already scanned"
        : "Entry blocked · Ticket not found"
    );
  };
  useEffect(() => {
    if (!scanning) return;
    setCameraError("");
    let scanner: import("html5-qrcode").Html5Qrcode | undefined;
    let cancelled = false;
    void import("html5-qrcode")
      .then(async ({ Html5Qrcode }) => {
        if (cancelled) return;
        const activeScanner = new Html5Qrcode("reader");
        scanner = activeScanner;
        await activeScanner.start(
          { facingMode: "environment" },
          { fps: 10 },
          (decoded) => {
            verifyTicket(decoded);
            void activeScanner.stop().catch(() => {});
          },
          () => {}
        );
        if (cancelled && activeScanner.isScanning) await activeScanner.stop();
      })
      .catch(() => {
        if (!cancelled) {
          setScanning(false);
          setCameraError(
            "Camera unavailable. Allow camera access or test a ticket below."
          );
        }
      });
    return () => {
      cancelled = true;
      if (scanner?.isScanning) void scanner.stop().catch(() => {});
    };
  }, [scanning]);
  const randomTicket = () =>
    `TKT-2026-RANDOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  return (
    <>
      <PageHead
        eyebrow="EAST ENTRY · CODE SPRINT"
        title="Entry scanner"
        description="Scan a ticket QR to verify a guest. One scan, one smooth entry."
        action={
          <span className="scanner-live">
            <i /> SCANNER READY
          </span>
        }
      />
      <div className="scanner-layout">
        <div className="scanner-camera">
          <div id="reader" className="camera-view">
            <div className="camera-fallback">
              <div className="camera-scan-icon">
                <ScanLine size={36} />
              </div>
              <span>
                {scanning ? "Point the camera at a ticket QR" : "Camera view"}
              </span>
              <small>
                {cameraError ||
                  (scanning
                    ? "Hold steady · QR will scan automatically"
                    : "Start the scanner or test a ticket below")}
              </small>
            </div>
          </div>
          <div className="camera-bottom">
            <span>
              <span className="live-dot" /> CAMERA · BACK
            </span>
            <button className="icon-button" aria-label="Switch camera">
              <Settings size={16} />
            </button>
          </div>
          <div className="scan-actions">
            <button
              className="btn btn-dark btn-wide"
              onClick={() => {
                setResult(null);
                setScanning(!scanning);
              }}
            >
              {scanning ? (
                <>
                  <X size={16} /> Stop camera
                </>
              ) : (
                <>
                  <ScanLine size={16} />{" "}
                  {result ? "Scan next ticket" : "Start camera"}
                </>
              )}
            </button>
            <button
              className="btn btn-outline btn-wide"
              onClick={() => verifyTicket(sampleRegistration.ticketId)}
            >
              <QrCode size={16} /> Try valid demo
            </button>
            <button
              className="btn btn-outline btn-wide"
              onClick={() => verifyTicket(randomTicket())}
            >
              <X size={16} /> Test random ticket
            </button>
          </div>
        </div>
        <div className="scan-result-panel">
          <span className="section-kicker">LATEST SCAN</span>
          {result ? (
            <div className={`scan-success scan-${result.status}`}>
              <div className={`result-check result-${result.status}`}>
                {result.status === "valid" ? (
                  <Check size={23} />
                ) : (
                  <X size={23} />
                )}
              </div>
              <span className={`status-badge scan-badge-${result.status}`}>
                <i />{" "}
                {result.status === "valid"
                  ? "ENTRY VERIFIED"
                  : result.status === "duplicate"
                  ? "DUPLICATE TICKET"
                  : "INVALID TICKET"}
              </span>
              <h2>
                {result.status === "valid"
                  ? "Rahul Sharma"
                  : result.status === "duplicate"
                  ? "Already checked in"
                  : "Ticket not found"}
              </h2>
              <p>
                {result.status === "valid"
                  ? "Team ByteBusters"
                  : result.status === "duplicate"
                  ? "This ticket has already been used."
                  : "No registration matches this QR code."}
              </p>
              <div className="result-ticket">
                <span>TICKET ID</span>
                <b>{result.ticketId}</b>
              </div>
              <div className={`entry-allowed entry-${result.status}`}>
                <ShieldCheck size={17} />{" "}
                {result.status === "valid"
                  ? "Entry allowed · Valid ticket"
                  : result.status === "duplicate"
                  ? "Entry denied · Already scanned"
                  : "Entry denied · Unregistered ticket"}
              </div>
              <button
                className="btn btn-dark btn-wide"
                onClick={() => setResult(null)}
              >
                Ready for next guest <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="scan-empty">
              <div className="scan-empty-icon">
                <QrCode size={24} />
              </div>
              <h3>All clear here.</h3>
              <p>
                Scanned tickets will show up in this space. Keep an eye out for
                duplicate or invalid passes.
              </p>
            </div>
          )}
          <div className="scan-counter">
            <span>THIS SHIFT</span>
            <b>128</b>
            <small>guests checked in</small>
            <i>
              <em />
            </i>
          </div>
        </div>
      </div>
    </>
  );
}

function ScanLogs() {
  return (
    <>
      <PageHead
        eyebrow="EAST ENTRY · CODE SPRINT"
        title="Scan history"
        description="Every check-in from your shift, all in one place."
        action={
          <button className="btn btn-outline">
            <Download size={15} /> Export log
          </button>
        }
      />
      <div className="logs-card">
        <div className="logs-toolbar">
          <div className="inline-search">
            <Search size={16} />
            <input placeholder="Search by name or ticket ID" />
          </div>
          <button className="btn btn-outline">
            All statuses <ChevronDown size={14} />
          </button>
          <button className="btn btn-outline">
            <CalendarDays size={15} /> Today <ChevronDown size={14} />
          </button>
        </div>
        <div className="logs-table">
          <div className="logs-head">
            <span>PARTICIPANT</span>
            <span>TICKET ID</span>
            <span>TIME</span>
            <span>STATUS</span>
          </div>
          {[
            [
              "Priya Nair",
              "Pixel Pioneers",
              "TKT-2026-E1-R2",
              "09:47 AM",
              "Checked in",
            ],
            [
              "Dev Khanna",
              "Solo entry",
              "TKT-2026-E1-R3",
              "09:44 AM",
              "Checked in",
            ],
            [
              "Rhea Joshi",
              "ByteBusters",
              "TKT-2026-E1-R4",
              "09:39 AM",
              "Checked in",
            ],
            [
              "Kabir Rao",
              "The Debuggers",
              "TKT-2026-E1-R5",
              "09:31 AM",
              "Duplicate",
            ],
          ].map((r, i) => (
            <div className="logs-row" key={r[0]}>
              <div className="logs-participant">
                <img src={`https://i.pravatar.cc/80?img=${20 + i * 4}`} />
                <span>
                  <b>{r[0]}</b>
                  <small>{r[1]}</small>
                </span>
              </div>
              <code>{r[2]}</code>
              <span className="logs-time">{r[3]}</span>
              <span
                className={
                  r[4] === "Duplicate" ? "status-duplicate" : "status-valid"
                }
              >
                <i />
                {r[4]}
              </span>
            </div>
          ))}
        </div>
        <div className="table-foot">
          Showing 4 of 128 entries{" "}
          <span>← Previous &nbsp;&nbsp; 1 &nbsp; 2 &nbsp; 3 &nbsp; Next →</span>
        </div>
      </div>
    </>
  );
}

function AdminDashboard({ toast }: { toast: (s: string) => void }) {
  return (
    <>
      <div className="admin-welcome">
        <div>
          <div className="eyebrow">
            SATURDAY, SEPTEMBER 26, 2026 · 19 DAYS TO GO
          </div>
          <h1>
            Good morning, Samira <span>✳</span>
          </h1>
          <p>The campus is warming up. Here’s how things are shaping up.</p>
        </div>
        <button
          className="btn btn-dark"
          onClick={() => toast("New event draft created")}
        >
          <Plus size={17} /> Create event
        </button>
      </div>
      <div className="admin-stats">
        <Stat
          label="Total registrations"
          value="2,482"
          detail={
            (
              <>
                <span className="trend-up">
                  <ArrowUpRight size={13} /> 18.4%
                </span>{" "}
                vs last year
              </>
            ) as unknown as string
          }
          icon={<Users />}
          tone="lavender"
        />
        <Stat
          label="Events published"
          value="18"
          detail="Across 6 categories"
          icon={<CalendarDays />}
          tone="peach"
        />
        <Stat
          label="Quiz participants"
          value="846"
          detail="Across 3 active quizzes"
          icon={<CircleHelp />}
          tone="mint"
        />
        <Stat
          label="Fest engagement"
          value="78%"
          detail="+6.2% this month"
          icon={<Activity />}
          tone="butter"
        />
      </div>
      <div className="admin-main-grid">
        <div className="admin-panel registration-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">REGISTRATION OVERVIEW</span>
              <h2>Interest is picking up.</h2>
            </div>
            <button className="btn btn-outline">
              Last 7 days <ChevronDown size={14} />
            </button>
          </div>
          <div className="chart-total">
            <b>2,482</b>
            <span>
              <ArrowUpRight size={14} /> 18.4%
            </span>
            <small>registrations this month</small>
          </div>
          <div className="chart">
            <div className="chart-y">
              <span>3k</span>
              <span>2k</span>
              <span>1k</span>
              <span>0</span>
            </div>
            <div className="chart-main">
              <div className="chart-lines">
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg
                viewBox="0 0 600 180"
                preserveAspectRatio="none"
                role="img"
                aria-label="Registrations trending up"
              >
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#7c5cf2" stopOpacity=".2" />
                    <stop offset="1" stopColor="#7c5cf2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,150 C40,130 50,138 85,117 S135,133 170,100 S220,110 250,80 S300,103 335,63 S390,80 420,53 S475,79 510,35 S560,53 600,12 L600,180 L0,180Z"
                  fill="url(#area)"
                />
                <path
                  d="M0,150 C40,130 50,138 85,117 S135,133 170,100 S220,110 250,80 S300,103 335,63 S390,80 420,53 S475,79 510,35 S560,53 600,12"
                  fill="none"
                  stroke="#795af1"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="chart-x">
                <span>SEP 20</span>
                <span>SEP 22</span>
                <span>SEP 24</span>
                <span>SEP 26</span>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-panel popular-panel">
          <div className="section-kicker">
            TOP PERFORMING EVENTS{" "}
            <Link to="/admin/events">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <PopularEvent
            title="Neon Nights"
            category="MUSIC"
            number="184"
            pct="84"
          />
          <PopularEvent
            title="CodeSprint 2026"
            category="TECHNICAL"
            number="72"
            pct="72"
          />
          <PopularEvent
            title="The Big Frame"
            category="CREATIVE"
            number="38"
            pct="47"
          />
          <button
            className="popular-cta"
            onClick={() => toast("Event analytics opened")}
          >
            View event analytics <ArrowRight size={15} />
          </button>
        </div>
      </div>
      <div className="admin-announcement">
        <div className="announce-mark">
          <Bell size={20} />
        </div>
        <div>
          <b>Give everyone the latest.</b>
          <p>
            Share a fest update with all students or a specific event group.
          </p>
        </div>
        <Link to="/admin/notifications" className="btn btn-dark">
          Write an announcement <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
}
function PopularEvent({
  title,
  category,
  number,
  pct,
}: {
  title: string;
  category: string;
  number: string;
  pct: string;
}) {
  return (
    <div className="popular-event">
      <span>
        <b>{title}</b>
        <small>{category}</small>
      </span>
      <b className="popular-n">
        {number}
        <small> / {pct === "84" ? "220" : pct === "72" ? "100" : "80"}</small>
      </b>
      <i>
        <em style={{ width: `${pct}%` }} />
      </i>
    </div>
  );
}

function AdminEvents({ toast }: { toast: (s: string) => void }) {
  const [list, setList] = useState(events);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  return (
    <>
      <PageHead
        eyebrow="MAKE IT HAPPEN"
        title="Events"
        description="Create the moments your campus will remember."
        action={
          <button className="btn btn-dark" onClick={() => setModal(true)}>
            <Plus size={16} /> Create event
          </button>
        }
      />
      <div className="admin-list">
        {list.map((e) => (
          <div className="admin-event-row" key={e.id}>
            <img src={e.image} />
            <span>
              <b>{e.title}</b>
              <small>
                {e.category} · {e.date} · {e.venue}
              </small>
            </span>
            <span className="admin-event-count">
              {e.registered} <small>/ {e.maxParticipants} registered</small>
            </span>
            <span className="status-badge">
              <i /> PUBLISHED
            </span>
            <button
              className="icon-button"
              aria-label="Edit event"
              onClick={() => toast("Event details ready to edit")}
            >
              <Settings size={16} />
            </button>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title="Create an event" close={() => setModal(false)}>
          <label>
            Event name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Big Idea"
            />
          </label>
          <label>
            Category
            <select>
              <option>Technical</option>
              <option>Music</option>
              <option>Creative</option>
            </select>
          </label>
          <label>
            Description
            <textarea placeholder="What will guests experience?" />
          </label>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setModal(false)}>
              Cancel
            </button>
            <button
              className="btn btn-dark"
              onClick={() => {
                if (name.trim())
                  setList([
                    {
                      ...sampleEvent,
                      id: Date.now().toString(),
                      title: name,
                      registered: 0,
                    },
                    ...list,
                  ]);
                setModal(false);
                toast(name ? `“${name}” created` : "Draft saved");
              }}
            >
              Save event <ArrowRight size={15} />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Participants() {
  return (
    <>
      <PageHead
        eyebrow="YOUR COMMUNITY, IN ONE PLACE"
        title="Participants"
        description="A live look at everyone showing up for the fest."
        action={
          <button className="btn btn-outline">
            <Download size={15} /> Export list
          </button>
        }
      />
      <div className="participant-stats">
        <Stat
          label="Registered"
          value="2,482"
          detail="Across 18 events"
          icon={<Users />}
          tone="lavender"
        />
        <Stat
          label="Teams"
          value="386"
          detail="Average 3.2 per team"
          icon={<Flame />}
          tone="peach"
        />
        <Stat
          label="Checked in"
          value="128"
          detail="CodeSprint today"
          icon={<Check />}
          tone="mint"
        />
      </div>
      <div className="logs-card">
        <div className="logs-toolbar">
          <div className="inline-search">
            <Search size={16} />
            <input placeholder="Search participants" />
          </div>
          <button className="btn btn-outline">
            All events <ChevronDown size={14} />
          </button>
          <button className="btn btn-outline">
            Status <ChevronDown size={14} />
          </button>
        </div>
        <div className="logs-table">
          <div className="participant-head">
            <span>PARTICIPANT</span>
            <span>EVENT / TEAM</span>
            <span>REGISTERED</span>
            <span>STATUS</span>
          </div>
          {["Rahul Sharma", "Priya Nair", "Dev Khanna", "Rhea Joshi"].map(
            (n, i) => (
              <div className="participant-row" key={n}>
                <div className="logs-participant">
                  <img
                    src={
                      i === 0
                        ? sampleUser.avatar
                        : `https://i.pravatar.cc/80?img=${25 + i * 4}`
                    }
                  />
                  <span>
                    <b>{n}</b>
                    <small>{n.split(" ")[0].toLowerCase()}@college.edu</small>
                  </span>
                </div>
                <span>
                  <b>{i === 1 ? "Neon Nights" : "CodeSprint 2026"}</b>
                  <small>
                    {
                      [
                        "ByteBusters",
                        "Pixel Pioneers",
                        "Solo entry",
                        "ByteBusters",
                      ][i]
                    }
                  </small>
                </span>
                <span className="logs-time">Sep {19 - i}, 2026</span>
                <span className="status-valid">
                  <i />
                  Confirmed
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

function QuizBuilder({ toast }: { toast: (s: string) => void }) {
  const [title, setTitle] = useState("Tech Trivia");
  const [duration, setDuration] = useState(60);
  const [question, setQuestion] = useState(sampleQuiz.questions[0].text);
  const [options, setOptions] = useState([...sampleQuiz.questions[0].options]);
  const [correct, setCorrect] = useState(0);
  const [extra, setExtra] = useState<string[]>([]);
  return (
    <>
      <PageHead
        eyebrow="BUILD A LITTLE FRIENDLY COMPETITION"
        title="Quiz builder"
        description="Give curious minds something fun to get into."
        action={
          <button className="btn btn-outline">
            <Eye size={15} /> Preview
          </button>
        }
      />
      <div className="builder-layout">
        <div className="builder-main">
          <div className="builder-settings panel bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800">
            <label>
              QUIZ TITLE
              <input
                className="bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              DURATION
              <select
                className="bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={30}>30 seconds per question</option>
                <option value={60}>60 seconds per question</option>
                <option value={90}>90 seconds per question</option>
              </select>
            </label>
          </div>
          <div className="builder-question panel bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800">
            <div className="builder-question-head">
              <span>QUESTION 01</span>
              <button
                className="icon-button dark:text-zinc-200 dark:hover:bg-zinc-800"
                aria-label="Remove question"
                onClick={() => toast("Keep at least one question in the quiz")}
              >
                <X size={15} />
              </button>
            </div>
            <label className="field-label">
              QUESTION TEXT
              <input
                className="bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Write a question"
              />
            </label>
            <div className="builder-options-head">
              <span className="field-label">ANSWER OPTIONS</span>
              <span className="correct-caption">SELECT THE CORRECT ANSWER</span>
            </div>
            {options.map((option, i) => (
              <div
                className={`builder-option text-zinc-800 dark:text-zinc-200 dark:border-zinc-700 ${
                  correct === i ? "correct" : ""
                }`}
                key={i}
              >
                <button
                  className="radio-dot"
                  aria-label={`Set option ${i + 1} as correct`}
                  onClick={() => setCorrect(i)}
                />
                <input
                  value={option}
                  className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  onChange={(e) =>
                    setOptions(
                      options.map((v, j) => (j === i ? e.target.value : v))
                    )
                  }
                />
                {correct === i && (
                  <span>
                    <Check size={12} /> Correct
                  </span>
                )}
              </div>
            ))}
            {extra.map((value, i) => (
              <div
                className="builder-option text-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                key={`extra-${i}`}
              >
                <i className="radio-dot" />
                <input
                  value={value}
                  className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  onChange={(e) =>
                    setExtra(
                      extra.map((v, j) => (j === i ? e.target.value : v))
                    )
                  }
                  placeholder={`Option ${options.length + i + 1}`}
                />
                <button
                  className="icon-button dark:text-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Remove option"
                  onClick={() => setExtra(extra.filter((_, j) => j !== i))}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              className="text-link add-option"
              onClick={() => setExtra([...extra, ""])}
            >
              <Plus size={14} /> Add option
            </button>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => toast("Question added")}
          >
            <Plus size={15} /> Add question
          </button>
          <div className="builder-save">
            <span>
              <ShieldCheck size={15} /> Changes save to this demo session
            </span>
            <button
              className="btn btn-dark"
              onClick={() =>
                toast(
                  title.trim() && question.trim()
                    ? "Quiz saved and ready to publish"
                    : "Add a quiz title and question first"
                )
              }
            >
              Save quiz <ArrowRight size={15} />
            </button>
          </div>
        </div>
        <aside className="builder-aside">
          <div className="builder-summary panel bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800">
            <span className="section-kicker">QUIZ SUMMARY</span>
            <h3>{title || "Untitled quiz"}</h3>
            <div>
              <Clock3 /> {duration} seconds per question
            </div>
            <div>
              <CircleHelp /> {1 + extra.length * 0} question
            </div>
            <div>
              <Users /> Open to all students
            </div>
            <span className="draft-pill">DRAFT · NOT PUBLISHED</span>
          </div>
          <div className="builder-tip dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800">
            <Sparkles />
            <b>Keep it snappy.</b>
            <p>
              Short questions and clear answers make for a better quiz
              experience.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Announcement({ toast }: { toast: (s: string) => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All students");
  const [priority, setPriority] = useState("Standard");
  return (
    <>
      <PageHead
        eyebrow="KEEP EVERYONE IN THE LOOP"
        title="Announcements"
        description="One clear message can make everyone’s day go smoother."
      />
      <div className="announce-layout">
        <div className="announce-form panel">
          <div className="form-section-title">
            <span>01</span>
            <div>
              <b>Who needs to know?</b>
              <small>Choose who will see your announcement.</small>
            </div>
          </div>
          <div className="audience-options">
            {[
              "All students",
              "Event participants",
              "Quiz participants",
              "Specific event",
            ].map((a, i) => (
              <button
                key={a}
                className={audience === a ? "selected" : ""}
                onClick={() => setAudience(a)}
              >
                <span className="audience-icon">
                  {i === 0 ? (
                    <Users />
                  ) : i === 1 ? (
                    <Ticket />
                  ) : i === 2 ? (
                    <CircleHelp />
                  ) : (
                    <CalendarDays />
                  )}
                </span>
                <span>
                  <b>{a}</b>
                  <small>
                    {
                      [
                        "Everyone with a student account",
                        "People signed up for events",
                        "Students playing the quizzes",
                        "Choose one event",
                      ][i]
                    }
                  </small>
                </span>
                <i className="radio-dot" />
              </button>
            ))}
          </div>
          {audience === "Specific event" && (
            <select className="form-select">
              <option>CodeSprint 2026</option>
              <option>Neon Nights</option>
              <option>The Big Frame</option>
            </select>
          )}
          <div className="form-section-title">
            <span>02</span>
            <div>
              <b>Write your message</b>
              <small>Keep it short, clear, and useful.</small>
            </div>
          </div>
          <label className="field-label">
            TITLE
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A quick heads-up…"
              maxLength={60}
            />
            <small>{title.length} / 60</small>
          </label>
          <label className="field-label">
            MESSAGE
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What should everyone know?"
              rows={4}
            />
            <small>{message.length} / 280</small>
          </label>
          <label className="field-label">
            PRIORITY
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Standard</option>
              <option>Important</option>
              <option>Urgent</option>
            </select>
          </label>
          <button
            className="btn btn-dark btn-wide"
            onClick={() => {
              if (!title.trim() || !message.trim()) {
                toast("Add a title and message first");
                return;
              }
              toast(`Announcement sent to ${audience.toLowerCase()}`);
              setTitle("");
              setMessage("");
            }}
          >
            Send announcement <ArrowRight size={15} />
          </button>
          <small className="form-note">
            <ShieldCheck size={14} /> You can review before sending. This action
            will notify the selected audience.
          </small>
        </div>
        <aside className="announce-preview">
          <div className="section-kicker">
            LIVE PREVIEW <span>AS A STUDENT</span>
          </div>
          <div className="phone-preview">
            <div className="phone-top">
              <span>9:41</span>
              <span>●●● ▰</span>
            </div>
            <div className="phone-notice">
              <div className="preview-icon">
                <Bell size={17} />
              </div>
              <span className="preview-app">
                FestiQO <small>now</small>
              </span>
              <b>{title || "Your announcement title"}</b>
              <p>
                {message ||
                  "Your message will appear here, just as it will for students."}
              </p>
              <small className="audience-pill">
                {audience} · {priority}
              </small>
            </div>
            <div className="phone-nav">
              <span />
              <span />
              <span />
            </div>
          </div>
          <p className="preview-hint">
            This is how it’ll look in the student notification center.
          </p>
        </aside>
      </div>
    </>
  );
}

function NotificationCenter() {
  const [items, setItems] = useState(notices);
  const unread = items.filter((n) => !n.isRead).length;
  return (
    <>
      <PageHead
        eyebrow="ALL CAUGHT UP?"
        title="Notifications"
        description="Your fest, your events, your updates. All in one place."
        action={
          <button
            className="btn btn-outline"
            onClick={() => setItems(items.map((n) => ({ ...n, isRead: true })))}
          >
            <Check size={15} /> Mark all as read
          </button>
        }
      />
      <div className="notification-list">
        <div className="notification-summary">
          <span>{unread} unread</span>
          <span>LAST 7 DAYS</span>
        </div>
        {items.map((n) => (
          <article
            key={n.id}
            className={`notification-item ${n.isRead ? "read" : ""}`}
            onClick={() =>
              setItems(
                items.map((item) =>
                  item.id === n.id ? { ...item, isRead: true } : item
                )
              )
            }
          >
            <span className={`notification-icon nt-${n.type}`}>
              {n.type === "result" ? (
                <Trophy />
              ) : n.type === "event" ? (
                <CalendarDays />
              ) : n.type === "registration" ? (
                <Ticket />
              ) : (
                <Bell />
              )}
            </span>
            <div className="notification-copy">
              <div>
                <b>{n.title}</b>
                {!n.isRead && <i className="unread-dot" />}
              </div>
              <p>{n.message}</p>
              <small>
                {new Date(n.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                · FestiQO
              </small>
            </div>
            <button
              className="notification-mark"
              aria-label={n.isRead ? "Mark as unread" : "Mark as read"}
              onClick={(e) => {
                e.stopPropagation();
                setItems(
                  items.map((item) =>
                    item.id === n.id ? { ...item, isRead: !item.isRead } : item
                  )
                );
              }}
            >
              {n.isRead ? "Read" : "Mark read"}
            </button>
          </article>
        ))}
      </div>
      {!items.length && (
        <Empty
          icon={<Bell />}
          title="You’re all caught up"
          text="New event updates and quiz results will show up here."
        />
      )}
    </>
  );
}

function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [close]);
  return (
    <div className="modal-backdrop" onClick={close}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Close" onClick={close}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Empty({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="empty-state">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;
