"use client";

import { useEffect, useRef, useState } from "react";
import { fetchAuthProviders, supabaseConfig, type AuthProviders } from "./session";

type Lang = "uz" | "en";
type Mode = "login" | "signup" | "confirm" | "reset";
type Note = { kind: "info" | "error" | "success"; text: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* Mirrors the profiles.username check constraint — a username the database
   would reject used to produce an auth account with no profile row. */
const USERNAME_RE = /^[a-zA-Z0-9_]{3,24}$/;
const MIN_PASSWORD = 8;

const L = {
  uz: {
    welcome: "Xush kelibsiz",
    create: "Hisob yarating",
    resetTitle: "Parolni tiklash",
    checkMail: "Emailingizni tekshiring",
    tagline: "O‘rganing. Mashq qiling. Duelda bellashing. O‘sing.",
    confirmCopy: "Xabardagi tasdiqlash havolasini bosing — AlgoYo‘l avtomatik ochiladi.",
    resetCopy: "Email manzilingizni kiriting — parolni tiklash havolasini yuboramiz.",
    google: "Google orqali kirish",
    orEmail: "yoki email bilan",
    username: "Foydalanuvchi nomi",
    usernameHelp: "Lotin harflari, raqamlar va _ · 3–24 belgi. Bu sizning ommaviy nomingiz.",
    email: "Email",
    password: "Parol",
    passwordHelp: `Kamida ${MIN_PASSWORD} belgi.`,
    confirmPassword: "Parolni tasdiqlang",
    show: "Ko‘rsatish",
    hide: "Yashirish",
    remember: "Meni eslab qol",
    forgot: "Parolni unutdingizmi?",
    signIn: "Kirish",
    signUp: "Ro‘yxatdan o‘tish",
    wait: "Kuting…",
    sendLink: "Havola yuborish",
    backToLogin: "Kirish sahifasiga qaytish",
    resend: "Xabarni qayta yuborish",
    noAccount: "Hisob yo‘qmi? Ro‘yxatdan o‘ting",
    haveAccount: "Hisobingiz bormi? Kiring",
    errEmail: "To‘g‘ri email manzilini kiriting.",
    errPassword: `Parol kamida ${MIN_PASSWORD} belgidan iborat bo‘lsin.`,
    errMatch: "Parollar mos kelmadi.",
    errUsername: "Faqat lotin harflari, raqamlar va _ · 3–24 belgi.",
    notConfigured: "Autentifikatsiya xizmati sozlanmagan. Administratorga murojaat qiling.",
    needConfirm: "Avval emailingizdagi tasdiqlash havolasini bosing.",
    sending: "So‘rov yuborilmoqda…",
    sentTo: (email: string) => `Tasdiqlash xabari ${email} manziliga yuborildi.`,
    resetSent: (email: string) => `Parolni tiklash havolasi ${email} manziliga yuborildi.`,
    resent: "Tasdiqlash xabari qayta yuborildi.",
    offline: "Xizmatga ulanib bo‘lmadi. Internetni tekshiring.",
    guestHint: "Ro‘yxatdan o‘tmasdan ham darslarni ko‘rishingiz mumkin — progress esa faqat hisobingizda saqlanadi.",
    googleOff: "Google orqali kirish hozircha yoqilmagan. Email va parol bilan davom eting.",
  },
  en: {
    welcome: "Welcome back",
    create: "Create account",
    resetTitle: "Reset password",
    checkMail: "Check your email",
    tagline: "Learn. Practice. Duel. Grow.",
    confirmCopy: "Click the confirmation link in the email — AlgoYo‘l will open automatically.",
    resetCopy: "Enter your email and we’ll send a password reset link.",
    google: "Continue with Google",
    orEmail: "or with email",
    username: "Username",
    usernameHelp: "Letters, digits and _ · 3–24 characters. This is your public name.",
    email: "Email",
    password: "Password",
    passwordHelp: `At least ${MIN_PASSWORD} characters.`,
    confirmPassword: "Confirm password",
    show: "Show",
    hide: "Hide",
    remember: "Remember me",
    forgot: "Forgot password?",
    signIn: "Sign in",
    signUp: "Create account",
    wait: "Please wait…",
    sendLink: "Send reset link",
    backToLogin: "Back to sign in",
    resend: "Resend confirmation",
    noAccount: "No account? Register",
    haveAccount: "Have an account? Sign in",
    errEmail: "Enter a valid email address.",
    errPassword: `Password must be at least ${MIN_PASSWORD} characters.`,
    errMatch: "Passwords do not match.",
    errUsername: "Letters, digits and _ only · 3–24 characters.",
    notConfigured: "Authentication is not configured. Contact the administrator.",
    needConfirm: "Confirm your email before signing in.",
    sending: "Sending request…",
    sentTo: (email: string) => `A confirmation message was sent to ${email}.`,
    resetSent: (email: string) => `A password reset link was sent to ${email}.`,
    resent: "Confirmation email sent again.",
    offline: "Could not reach the service. Check your connection.",
    guestHint: "You can browse the lessons without an account — progress is only saved once you sign in.",
    googleOff: "Google sign-in is not enabled yet. Continue with email and password.",
  },
};

export function AuthPage({
  lang,
  onAuthenticated,
  notice,
  intent,
}: {
  lang: Lang;
  onAuthenticated: (token: string, remember: boolean, isNew: boolean) => void;
  notice?: string;
  intent?: "login" | "signup";
}) {
  const t = L[lang];
  const [mode, setMode] = useState<Mode>(intent === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [note, setNote] = useState<Note>(notice ? { kind: "info", text: notice } : null);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const firstField = useRef<HTMLInputElement>(null);
  // null = still asking the backend which providers it accepts
  const [providers, setProviders] = useState<AuthProviders | null>(null);

  useEffect(() => {
    firstField.current?.focus();
  }, [mode]);

  useEffect(() => {
    let live = true;
    fetchAuthProviders().then((p) => {
      if (live) setProviders(p);
    });
    return () => {
      live = false;
    };
  }, []);

  const ready = () => {
    const { url, key } = supabaseConfig();
    if (url && key) return true;
    setNote({ kind: "error", text: t.notConfigured });
    return false;
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!EMAIL_RE.test(email.trim())) next.email = t.errEmail;
    if (mode !== "reset") {
      if (password.length < MIN_PASSWORD) next.password = t.errPassword;
      if (mode === "signup") {
        if (!USERNAME_RE.test(username.trim())) next.username = t.errUsername;
        if (password !== password2) next.password2 = t.errMatch;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const google = () => {
    if (!ready()) return;
    // Belt and braces: the button is only rendered when the provider is on,
    // but never navigate the user off-site to a provider error page.
    if (providers && !providers.google) {
      setNote({ kind: "error", text: t.googleOff });
      return;
    }
    const { url } = supabaseConfig();
    window.location.href = `${url}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
      `${window.location.origin}/`,
    )}`;
  };

  const authenticate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!ready() || !validate()) return;
    const { url, key } = supabaseConfig();
    setBusy(true);
    setNote({ kind: "info", text: t.sending });
    const redirect = `${window.location.origin}/`;
    const endpoint =
      mode === "signup" ? `signup?redirect_to=${encodeURIComponent(redirect)}` : "token?grant_type=password";
    try {
      const response = await fetch(`${url}/auth/v1/${endpoint}`, {
        method: "POST",
        headers: { apikey: key as string, "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          ...(mode === "signup" ? { data: { username: username.trim(), display_name: username.trim() } } : {}),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const text = String(result.error_description || result.msg || result.message || "");
        setNote({ kind: "error", text: text.toLowerCase().includes("confirm") ? t.needConfirm : text || t.offline });
        return;
      }
      if (mode === "signup") {
        if (result.access_token) {
          onAuthenticated(result.access_token, remember, true);
          return;
        }
        setMode("confirm");
        setNote({ kind: "success", text: t.sentTo(email.trim()) });
        return;
      }
      if (!result.user?.email_confirmed_at) {
        setMode("confirm");
        setNote({ kind: "error", text: t.needConfirm });
        return;
      }
      onAuthenticated(result.access_token, remember, false);
    } catch {
      setNote({ kind: "error", text: t.offline });
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!ready() || busy) return;
    const { url, key } = supabaseConfig();
    setBusy(true);
    try {
      const response = await fetch(
        `${url}/auth/v1/resend?redirect_to=${encodeURIComponent(`${window.location.origin}/`)}`,
        {
          method: "POST",
          headers: { apikey: key as string, "content-type": "application/json" },
          body: JSON.stringify({ type: "signup", email: email.trim() }),
        },
      );
      const result = await response.json().catch(() => ({}));
      setNote(
        response.ok
          ? { kind: "success", text: t.resent }
          : { kind: "error", text: result.msg || result.message || t.offline },
      );
    } catch {
      setNote({ kind: "error", text: t.offline });
    } finally {
      setBusy(false);
    }
  };

  const recover = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!ready()) return;
    if (!EMAIL_RE.test(email.trim())) {
      setErrors({ email: t.errEmail });
      return;
    }
    const { url, key } = supabaseConfig();
    setBusy(true);
    setNote({ kind: "info", text: t.sending });
    try {
      const response = await fetch(
        `${url}/auth/v1/recover?redirect_to=${encodeURIComponent(`${window.location.origin}/`)}`,
        {
          method: "POST",
          headers: { apikey: key as string, "content-type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        },
      );
      const result = await response.json().catch(() => ({}));
      setNote(
        response.ok
          ? { kind: "success", text: t.resetSent(email.trim()) }
          : { kind: "error", text: result.msg || result.error_description || result.message || t.offline },
      );
    } catch {
      setNote({ kind: "error", text: t.offline });
    } finally {
      setBusy(false);
    }
  };

  const heading =
    mode === "login" ? t.welcome : mode === "signup" ? t.create : mode === "reset" ? t.resetTitle : t.checkMail;
  const subtitle = mode === "confirm" ? t.confirmCopy : mode === "reset" ? t.resetCopy : t.tagline;
  const switchMode = (next: Mode) => {
    setMode(next);
    setNote(null);
    setErrors({});
  };

  return (
    <div className="auth">
      <div className="brand">
        <span className="brandmark" aria-hidden>
          A›
        </span>
        AlgoYo‘l
      </div>
      <h1>{heading}</h1>
      <p className="muted">{subtitle}</p>

      {note && (
        <div
          className={note.kind === "error" ? "notice notice-error" : note.kind === "success" ? "notice" : "notice notice-info"}
          role={note.kind === "error" ? "alert" : "status"}
        >
          {note.text}
        </div>
      )}

      {(mode === "login" || mode === "signup") && (
        <>
          {providers?.google && (
            <>
          <button type="button" className="google-btn" onClick={google}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.2h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.2-2.1 3.7-5.1 3.7-8.7z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.2-6.9-5.1l-3.9 3C3.2 21.3 7.3 24 12 24z"
              />
              <path fill="#FBBC05" d="M5.1 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.4 8.2 0 10 0 12s.4 3.8 1.2 5.3l3.9-3z" />
              <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3c1-2.9 3.7-5 6.9-5z" />
            </svg>
            {t.google}
          </button>
          <div className="auth-divider">
            <span>{t.orEmail}</span>
          </div>
            </>
          )}

          <form onSubmit={authenticate} noValidate>
            {mode === "signup" && (
              <div className="field">
                <label htmlFor="auth-username">{t.username}</label>
                <input
                  ref={firstField}
                  id="auth-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="algoyolchi"
                  autoComplete="username"
                  maxLength={24}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? "auth-username-error" : "auth-username-help"}
                />
                {errors.username ? (
                  <small id="auth-username-error" className="field-error" role="alert">
                    {errors.username}
                  </small>
                ) : (
                  <small id="auth-username-help" className="muted">
                    {t.usernameHelp}
                  </small>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="auth-email">{t.email}</label>
              <input
                ref={mode === "login" ? firstField : undefined}
                id="auth-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="siz@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "auth-email-error" : undefined}
              />
              {errors.email ? (
                <small id="auth-email-error" className="field-error" role="alert">
                  {errors.email}
                </small>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="auth-password">{t.password}</label>
              <div className="pwd-wrap">
                <input
                  id="auth-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "auth-password-error" : mode === "signup" ? "auth-password-help" : undefined}
                />
                <button type="button" className="pwd-toggle" onClick={() => setShow(!show)}>
                  {show ? t.hide : t.show}
                </button>
              </div>
              {errors.password ? (
                <small id="auth-password-error" className="field-error" role="alert">
                  {errors.password}
                </small>
              ) : mode === "signup" ? (
                <small id="auth-password-help" className="muted">
                  {t.passwordHelp}
                </small>
              ) : null}
            </div>

            {mode === "signup" && (
              <div className="field">
                <label htmlFor="auth-password2">{t.confirmPassword}</label>
                <input
                  id="auth-password2"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password2}
                  aria-describedby={errors.password2 ? "auth-password2-error" : undefined}
                />
                {errors.password2 ? (
                  <small id="auth-password2-error" className="field-error" role="alert">
                    {errors.password2}
                  </small>
                ) : null}
              </div>
            )}

            {mode === "login" && (
              <div className="auth-row">
                <label className="remember">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />{" "}
                  {t.remember}
                </label>
                <button type="button" className="auth-link" onClick={() => switchMode("reset")}>
                  {t.forgot}
                </button>
              </div>
            )}

            <button disabled={busy} className="primary auth-submit" type="submit">
              {busy ? t.wait : mode === "login" ? t.signIn : t.signUp}
            </button>
          </form>

          <button className="lang auth-switch" onClick={() => switchMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? t.noAccount : t.haveAccount}
          </button>
          <p className="muted auth-hint">{t.guestHint}</p>
        </>
      )}

      {mode === "reset" && (
        <form onSubmit={recover} noValidate>
          <div className="field">
            <label htmlFor="reset-email">{t.email}</label>
            <input
              ref={firstField}
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="siz@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "reset-email-error" : undefined}
            />
            {errors.email ? (
              <small id="reset-email-error" className="field-error" role="alert">
                {errors.email}
              </small>
            ) : null}
          </div>
          <button disabled={busy} className="primary auth-submit" type="submit">
            {busy ? t.wait : t.sendLink}
          </button>
          <button className="lang auth-switch" type="button" onClick={() => switchMode("login")}>
            {t.backToLogin}
          </button>
        </form>
      )}

      {mode === "confirm" && (
        <>
          <button disabled={busy} className="primary auth-submit" onClick={resend}>
            {busy ? t.wait : t.resend}
          </button>
          <button className="lang auth-switch" onClick={() => switchMode("login")}>
            {t.backToLogin}
          </button>
        </>
      )}
    </div>
  );
}
