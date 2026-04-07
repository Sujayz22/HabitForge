import { useState } from "react"
import { Link } from "react-router-dom"
import api from "@/services/api"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import { Zap } from "lucide-react"
export function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return
        setStatus("loading")
        try {
            const res = await api.post("/auth/forgot-password", { email })
            setStatus("success")
            setMessage(res.data.message || "Check your inbox for a reset link.")
        } catch (err: any) {
            setStatus("error")
            setMessage(err.response?.data?.message || "Something went wrong. Please try again.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
            style={{ background: "hsl(var(--background))" }}>
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center gap-3 justify-center mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ background: "var(--green)", color: "var(--save-btn-text)" }}>
                            <Zap className="h-5 w-5" fill="currentColor" />
                        </div>
                        <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "14px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>HabitForge</span>
                    </div>
                    <h1 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>Forgot Password</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                        Enter your email and we'll send a reset link
                    </p>
                </div>

                <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--divider)" }}>
                    {status === "success" ? (
                        <div className="text-center py-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto mb-4"
                                style={{ background: "var(--green-dim)" }}>
                                <Mail className="h-6 w-6" style={{ color: "var(--green)" }} />
                            </div>
                            <p className="font-semibold mb-1" style={{ color: "var(--text-heading)" }}>Check your inbox</p>
                            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{message}</p>
                            <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                                The link expires in 1 hour. Check your spam folder if you don't see it.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-tertiary)" }}>
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    autoFocus
                                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                    style={{ background: "var(--surface-2)", border: "1px solid var(--input-border)", color: "var(--text-heading)" }}
                                />
                            </div>

                            {status === "error" && (
                                <p className="text-xs font-semibold p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold disabled:opacity-60"
                                style={{ background: "var(--green)", color: "var(--save-btn-text)" }}
                            >
                                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                                Send Reset Link
                            </button>
                        </form>
                    )}
                </div>

                <div className="text-center mt-5">
                    <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                        style={{ color: "var(--green)" }}>
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}
