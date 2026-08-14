"use client";

import { useCallback, useEffect, useState } from "react";
import { readStoredToken } from "./AuthPage";
import type { Lang, Profile, Role } from "./AlgoYolApp";

type UserRow = { id: string; username: string; display_name: string; role: Role; duel_rating: number; solved_count: number; suspended_until: string | null; created_at: string };
type SubmissionRow = { id: string; user_id: string; problem_key: string | null; language: string; status: string; context: string; source_code?: string; created_at: string };
type SettingRow = { key: string; value: Record<string, unknown>; updated_at: string };

async function adminFetch(path: string, init?: RequestInit) {
  const token = readStoredToken();
  if (!token) throw new Error("Authentication required.");
  const response = await fetch(path, { ...init, headers: { authorization: `Bearer ${token}`, ...(init?.body ? { "content-type": "application/json" } : {}), ...init?.headers }, cache: "no-store" });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(String(payload.error || "Admin request failed."));
  return payload;
}

export function AdminConsole({ lang, profile }: { lang: Lang; profile: Profile }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [settingDrafts, setSettingDrafts] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"users" | "submissions" | "settings">("users");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true); setMessage("");
    try {
      const [userPayload, submissionPayload, settingPayload] = await Promise.all([
        adminFetch("/api/admin/users"),
        adminFetch("/api/submissions?scope=all&includeSource=1&limit=50"),
        profile.role === "owner" ? adminFetch("/api/admin/settings") : Promise.resolve({ settings: [] }),
      ]);
      setUsers((userPayload.users || []) as UserRow[]);
      setSubmissions((submissionPayload.submissions || []) as SubmissionRow[]);
      const nextSettings = (settingPayload.settings || []) as SettingRow[];
      setSettings(nextSettings);
      setSettingDrafts(Object.fromEntries(nextSettings.map((setting) => [setting.key, JSON.stringify(setting.value, null, 2)])));
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Admin data is unavailable."); }
    finally { setBusy(false); }
  }, [profile.role]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const updateUser = async (userId: string, body: Record<string, unknown>) => {
    setBusy(true); setMessage("");
    try { await adminFetch("/api/admin/users", { method: "PATCH", body: JSON.stringify({ userId, ...body }) }); await load(); }
    catch (caught) { setMessage(caught instanceof Error ? caught.message : "User update failed."); setBusy(false); }
  };
  const saveSetting = async (key: string) => {
    setBusy(true); setMessage("");
    try {
      const value = JSON.parse(settingDrafts[key] || "{}") as unknown;
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(lang === "uz" ? "Sozlama JSON obyekt bo‘lishi kerak." : "Setting must be a JSON object.");
      await adminFetch("/api/admin/settings", { method: "PATCH", body: JSON.stringify({ key, value }) });
      await load();
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Setting update failed."); setBusy(false); }
  };

  return <>
    <div className="page-head"><div><p className="eyebrow">RBAC</p><h1 className="page-title">{lang === "uz" ? "Boshqaruv markazi" : "Management center"}</h1><p className="muted">{lang === "uz" ? "Har bir amal server permissioni va audit yozuvi bilan himoyalangan." : "Every action is protected by server permissions and audit logging."}</p></div><span className={`tag role-${profile.role}`}>{profile.role.toUpperCase()}</span></div>
    <div className="filters" role="tablist"><button role="tab" aria-selected={tab === "users"} className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>{lang === "uz" ? "Foydalanuvchilar" : "Users"}</button><button role="tab" aria-selected={tab === "submissions"} className={tab === "submissions" ? "active" : ""} onClick={() => setTab("submissions")}>{lang === "uz" ? "Yechimlar" : "Submissions"}</button>{profile.role === "owner" ? <button role="tab" aria-selected={tab === "settings"} className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>{lang === "uz" ? "Sozlamalar" : "Settings"}</button> : null}</div>
    {message ? <div className="notice error" role="alert">{message}</div> : null}
    {busy && !users.length ? <div className="notice" role="status">{lang === "uz" ? "Ma’lumot yuklanmoqda…" : "Loading management data…"}</div> : null}
    {tab === "users" ? <div className="management-table" role="region" aria-label={lang === "uz" ? "Foydalanuvchilar jadvali" : "Users table"} tabIndex={0}>{users.map((user) => <article className="management-row" key={user.id}><span><b>{user.display_name || user.username}</b><small className="muted block">@{user.username}</small></span><span className={`tag role-${user.role}`}>{user.role}</span><span className="mono">ELO {user.duel_rating} · AC {user.solved_count}</span><span className="actions">{profile.role === "owner" && user.id !== profile.id ? <><label className="visually-hidden" htmlFor={`role-${user.id}`}>{lang === "uz" ? "Rol" : "Role"}</label><select id={`role-${user.id}`} value={user.role} disabled={busy} onChange={(event) => void updateUser(user.id, { action: "role", role: event.target.value })}><option value="user">user</option><option value="admin">admin</option><option value="owner">owner</option></select><button className="secondary" disabled={busy} onClick={() => void updateUser(user.id, { action: "suspend", until: user.suspended_until ? null : new Date(Date.now() + 7 * 86_400_000).toISOString() })}>{user.suspended_until ? (lang === "uz" ? "Ochish" : "Unsuspend") : (lang === "uz" ? "7 kunga to‘xtatish" : "Suspend 7 days")}</button></> : <span className="muted">{lang === "uz" ? "Ko‘rish" : "View only"}</span>}</span></article>)}</div> : null}
    {tab === "submissions" ? <div className="management-table" role="region" aria-label={lang === "uz" ? "Yechimlar jadvali" : "Submissions table"} tabIndex={0}>{submissions.map((submission) => <article className="management-row submission-admin-row" key={submission.id}><span><b>{submission.problem_key || "—"}</b><small className="muted block">{new Date(submission.created_at).toLocaleString(lang === "uz" ? "uz-UZ" : "en-US")}</small></span><span className={`tag ${submission.status === "accepted" ? "tag-solved" : ""}`}>{submission.status}</span><span className="mono">{submission.language} · {submission.context}</span><details><summary>{lang === "uz" ? "Manba kodi" : "Source code"}</summary><pre className="admin-source"><code>{submission.source_code || (lang === "uz" ? "Ruxsat yo‘q" : "Not permitted")}</code></pre></details></article>)}</div> : null}
    {tab === "settings" && profile.role === "owner" ? <div className="admin-grid">{settings.map((setting) => <section className="panel" key={setting.key}><p className="eyebrow">{setting.key}</p><label className="field"><span>{lang === "uz" ? "JSON sozlama" : "JSON setting"}</span><textarea className="settings-json" value={settingDrafts[setting.key] || ""} onChange={(event) => setSettingDrafts((current) => ({ ...current, [setting.key]: event.target.value }))} spellCheck={false} /></label><button className="primary" disabled={busy} onClick={() => void saveSetting(setting.key)}>{lang === "uz" ? "Saqlash" : "Save"}</button></section>)}</div> : null}
  </>;
}
