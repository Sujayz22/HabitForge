import { Link } from "react-router-dom"
import { Zap, Hammer, Wrench, ArrowLeft, Loader2 } from "lucide-react"

export function ComingSoon() {
    return (
        <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 overflow-hidden relative"
            style={{ background: "hsl(var(--background))", color: "var(--text-primary)", fontFamily: "'Manrope', sans-serif" }}>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none animate-pulse duration-[3000ms]"
                style={{ background: "var(--green-dim)" }} />

            {/* Authentic HabitForge Logo */}
            <div className="flex items-center gap-3 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "var(--green)", color: "var(--save-btn-text)", boxShadow: "0 0 15px -3px var(--green-glow)" }}>
                    <Zap className="h-5 w-5" fill="currentColor" />
                </div>
                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "16px", color: "var(--text-primary)", letterSpacing: "0.02em", marginTop: "4px" }}>
                    HabitForge
                </span>
            </div>

            {/* Main Content Card */}
            <div className="relative z-10 max-w-lg w-full p-10 rounded-3xl backdrop-blur-md text-center shadow-2xl animate-in zoom-in-95 fade-in duration-700 delay-150 fill-mode-both"
                style={{ background: "var(--surface)", border: "1px solid var(--divider)" }}>

                {/* Graphics / Animated Elements */}
                <div className="flex justify-center items-center gap-6 mb-8">
                    <Wrench className="h-10 w-10 animate-bounce" style={{ color: "var(--green)", animationDelay: "0ms" }} />
                    <Loader2 className="h-12 w-12 animate-spin" style={{ color: "var(--text-secondary)" }} />
                    <Hammer className="h-10 w-10 animate-bounce" style={{ color: "var(--green)", animationDelay: "200ms", animationDirection: "alternate-reverse" }} />
                </div>

                <h1 className="text-4xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-heading)" }}>
                    Coming <span style={{ color: "var(--green)" }}>Soon</span>
                </h1>

                <p className="text-lg mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    We're actively working in the forge to bring you this feature. Check back later to see the sparks fly!
                </p>

                <Link
                    to="/"
                    className="group inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all backdrop-blur-md"
                    style={{ background: "var(--surface-2)", color: "var(--text-heading)", border: "1px solid var(--divider)" }}
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>
            </div>

            {/* Ambient Footer text */}
            <div className="absolute bottom-8 text-sm animate-in fade-in duration-1000 delay-500 fill-mode-both"
                style={{ color: "var(--text-muted)" }}>
                &copy; {new Date().getFullYear()} HabitForge. Forge your discipline.
            </div>
        </div>
    )
}
