import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme, type Theme } from "@/contexts/ThemeContext"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"
import { User, LogOut, Shield, Bell, AlertTriangle, Check, Loader2, Sun, Moon, Monitor } from "lucide-react"

type SaveState = "idle" | "saving" | "success" | "error"

function useSaveState() {
    const [state, setState] = useState<SaveState>("idle")
    const [msg, setMsg] = useState("")
    const trigger = async (fn: () => Promise<void>) => {
        setState("saving")
        setMsg("")
        try {
            await fn()
            setState("success")
            setMsg("Saved!")
            setTimeout(() => setState("idle"), 2500)
        } catch (err: any) {
            setState("error")
            setMsg(err.response?.data?.message || err.message || "Something went wrong")
            setTimeout(() => setState("idle"), 4000)
        }
    }
    return { state, msg, trigger }
}

function SaveBtn({ state, msg, label = "Save Changes" }: { state: SaveState; msg: string; label?: string }) {
    const isLoading = state === "saving"
    const isSuccess = state === "success"
    const isError = state === "error"
    return (
        <div className="flex items-center gap-3">
            <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 transition-all"
                style={{ background: "var(--green)", color: "var(--save-btn-text)" }}
            >
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isSuccess && <Check className="h-3.5 w-3.5" />}
                {label}
            </button>
            {msg && (
                <span className="text-xs font-semibold" style={{ color: isError ? "#ef4444" : "var(--green)" }}>
                    {msg}
                </span>
            )}
        </div>
    )
}

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "system", label: "System", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
]

export function Settings() {
    const { user, logout, updateUser } = useAuth()
    const { theme, setTheme } = useTheme()
    const navigate = useNavigate()

    // Profile section
    const [username, setUsername] = useState(user?.username || "")
    const [email, setEmail] = useState(user?.email || "")
    const profileSave = useSaveState()

    // Password section
    const [currentPwd, setCurrentPwd] = useState("")
    const [newPwd, setNewPwd] = useState("")
    const [confirmPwd, setConfirmPwd] = useState("")
    const pwdSave = useSaveState()

    // Notifications section
    const [notifs, setNotifs] = useState({
        dailyReminders: user?.notificationPrefs?.dailyReminders ?? true,
        streakAlerts: user?.notificationPrefs?.streakAlerts ?? true,
        clubActivity: user?.notificationPrefs?.clubActivity ?? true,
    })
    const notifSave = useSaveState()

    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteInput, setDeleteInput] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState("")

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault()
        profileSave.trigger(async () => {
            // Update username via profile endpoint
            if (username !== user?.username) {
                const res = await api.put("/users/profile", { username })
                updateUser({ username: res.data.data?.user?.username || username })
            }
            // Update email via dedicated endpoint
            if (email !== user?.email) {
                const res = await api.patch("/users/email", { email })
                updateUser({ email: res.data.data?.email || email })
            }
        })
    }

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault()
        pwdSave.trigger(async () => {
            if (!currentPwd || !newPwd || !confirmPwd) throw new Error("All fields are required")
            if (newPwd !== confirmPwd) throw new Error("New passwords do not match")
            if (newPwd.length < 6) throw new Error("Password must be at least 6 characters")
            await api.patch("/users/password", { currentPassword: currentPwd, newPassword: newPwd })
            setCurrentPwd(""); setNewPwd(""); setConfirmPwd("")
        })
    }

    const handleToggle = async (key: keyof typeof notifs) => {
        const updated = { ...notifs, [key]: !notifs[key] }
        setNotifs(updated)
        notifSave.trigger(async () => {
            await api.patch("/users/notifications", updated)
        })
    }

    const handleDeleteAccount = async () => {
        if (deleteInput !== "DELETE") return
        setIsDeleting(true)
        setDeleteError("")
        try {
            await api.delete("/users/profile")
            logout()
            navigate("/register")
        } catch (err: any) {
            setDeleteError(err.response?.data?.message || "Failed to delete account")
            setIsDeleting(false)
        }
    }

    const inputStyle = {
        background: "var(--input-bg)",
        border: "1px solid var(--input-border)",
        color: "var(--input-text)",
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Settings</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage your account and preferences</p>
            </div>

            {/* Profile */}
            <div className="surface-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4" style={{ color: "var(--green)" }} />
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Profile</h2>
                </div>
                <div className="flex items-center gap-4 mb-5">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ background: "var(--green-dim)", color: "var(--green)", border: "2px solid rgba(19,236,106,0.3)" }}>
                        {user?.username?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <div>
                        <div className="font-bold" style={{ color: "var(--text-heading)" }}>{user?.username}</div>
                        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{user?.email}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--green)" }}>Level {user?.level || 1} • {user?.xp || 0} XP</div>
                    </div>
                </div>
                <form onSubmit={handleProfileSave} className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-tertiary)" }}>Username</label>
                        <input value={username} onChange={e => setUsername(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={inputStyle} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-tertiary)" }}>Email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={inputStyle} />
                    </div>
                    <SaveBtn state={profileSave.state} msg={profileSave.msg} />
                </form>
            </div>

            {/* Appearance */}
            <div className="surface-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Sun className="h-4 w-4" style={{ color: "var(--green)" }} />
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Appearance</h2>
                </div>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    Choose how HabitForge looks. "System" follows your operating system's theme.
                </p>
                <div className="flex gap-2 p-1 rounded-xl" style={{ background: "var(--input-bg)" }}>
                    {THEME_OPTIONS.map(opt => {
                        const active = theme === opt.value
                        const Icon = opt.icon
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setTheme(opt.value)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                                style={{
                                    background: active ? "var(--green)" : "transparent",
                                    color: active ? "var(--save-btn-text)" : "var(--text-secondary)",
                                    boxShadow: active ? "0 2px 8px var(--green-glow)" : "none",
                                }}
                            >
                                <Icon className="h-4 w-4" />
                                {opt.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Security */}
            <div className="surface-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-4 w-4" style={{ color: "var(--green)" }} />
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Security</h2>
                </div>
                <form onSubmit={handlePasswordSave} className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-tertiary)" }}>Current Password</label>
                        <input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)}
                            placeholder="••••••••" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={inputStyle} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-tertiary)" }}>New Password</label>
                        <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)}
                            placeholder="••••••••" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={inputStyle} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-tertiary)" }}>Confirm New Password</label>
                        <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                            placeholder="••••••••" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={inputStyle} />
                    </div>
                    <SaveBtn state={pwdSave.state} msg={pwdSave.msg} label="Update Password" />
                </form>
            </div>

            {/* Notifications */}
            <div className="surface-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" style={{ color: "var(--green)" }} />
                        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Notifications</h2>
                    </div>
                    {notifSave.msg && (
                        <span className="text-xs font-semibold" style={{ color: notifSave.state === "error" ? "#ef4444" : "var(--green)" }}>
                            {notifSave.msg}
                        </span>
                    )}
                </div>
                {([
                    { key: "dailyReminders" as const, label: "Daily habit reminders", desc: "Get reminded to complete your habits" },
                    { key: "streakAlerts" as const, label: "Streak alerts", desc: "Alert when your streak is at risk" },
                    { key: "clubActivity" as const, label: "Club activity", desc: "Updates from your clubs" },
                ] as const).map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--divider)" }}>
                        <div>
                            <div className="text-sm font-medium" style={{ color: "var(--text-body)" }}>{item.label}</div>
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggle(item.key)}
                            className="w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 focus:outline-none"
                            style={{ background: notifs[item.key] ? "var(--green)" : "hsl(var(--muted))" }}
                            aria-checked={notifs[item.key]}
                            role="switch"
                        >
                            <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200"
                                style={{ left: notifs[item.key] ? "calc(100% - 18px)" : "2px" }} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Danger Zone */}
            <div className="surface-card p-5" style={{ borderColor: "var(--danger-border)" }}>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--danger)" }}>Danger Zone</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4" style={{ borderBottom: "1px solid var(--divider)" }}>
                        <div>
                            <div className="text-sm font-semibold" style={{ color: "var(--text-body)" }}>Sign Out</div>
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Log out of this device</div>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            style={{ background: "var(--btn-secondary-bg)", color: "var(--btn-secondary-text)", border: "1px solid var(--btn-secondary-border)" }}>
                            <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold" style={{ color: "var(--danger-text)" }}>Delete Account</div>
                            <div className="text-xs" style={{ color: "var(--danger-desc)", opacity: 0.8 }}>Permanently delete your data</div>
                        </div>
                        <button onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            style={{ background: "var(--danger-bg)", color: "var(--danger-text)", border: "1px solid var(--danger-border)" }}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: "var(--modal-overlay)" }}>
                    <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--modal-bg)", border: "1px solid var(--danger-border)" }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "var(--danger-bg)", color: "#ef4444" }}>
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Delete Account</h2>
                        </div>
                        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                            This action is <strong>irreversible</strong>. It will permanently delete your account, including all habits, logs, stats, and active sessions.
                        </p>
                        {deleteError && (
                            <div className="mb-4 text-xs font-semibold p-3 rounded" style={{ background: "var(--danger-bg)", color: "#ef4444", border: "1px solid var(--danger-border)" }}>
                                {deleteError}
                            </div>
                        )}
                        <div className="mb-6">
                            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--text-label)" }}>
                                Type <strong style={{ color: "var(--text-heading)" }}>DELETE</strong> to confirm
                            </label>
                            <input type="text" value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                                placeholder="DELETE" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: "var(--delete-confirm-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }} />
                        </div>
                        <div className="flex items-center gap-3 w-full">
                            <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); setDeleteError("") }}
                                disabled={isDeleting}
                                className="flex-1 py-2 rounded-lg text-sm font-semibold"
                                style={{ background: "var(--btn-secondary-bg)", color: "var(--text-label)", border: "1px solid var(--btn-secondary-border)" }}>
                                Cancel
                            </button>
                            <button onClick={handleDeleteAccount}
                                disabled={deleteInput !== "DELETE" || isDeleting}
                                className="flex-1 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                                style={{ background: "#ef4444", color: "white" }}>
                                {isDeleting ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
