import { Link } from "react-router-dom"
import { Users, BarChart3, ArrowRight, Zap, Target, Github, Heart } from "lucide-react"

export function LandingPage() {
    return (
        <div className="min-h-screen font-sans flex flex-col overflow-x-hidden"
            style={{ background: "hsl(var(--background))", color: "var(--text-primary)", fontFamily: "'Manrope', sans-serif" }}>
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md shrink-0 animate-in fade-in slide-in-from-top-4 duration-700"
                style={{ background: "hsla(var(--background), 0.8)", borderBottom: "1px solid var(--divider)" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Authentic HabitForge Logo */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--green)", color: "var(--save-btn-text)" }}>
                                <Zap className="h-4 w-4" fill="currentColor" />
                            </div>
                            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "12px", color: "var(--text-primary)", letterSpacing: "0.02em", marginTop: "2px" }}>
                                HabitForge
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium transition-opacity hover:opacity-70"
                                style={{ color: "var(--text-label)" }}>
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm font-semibold px-4 py-2 rounded-md transition-opacity hover:opacity-90"
                                style={{ background: "var(--green)", color: "var(--save-btn-text)" }}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col pt-16">

                {/* Hero Section */}
                <section className="relative w-full flex-1 flex flex-col items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-h-[500px]">
                    {/* Subtle Glow Background Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none animate-pulse duration-[4000ms]"
                        style={{ background: "var(--green-dim)" }} />

                    <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl animate-in fade-in zoom-in-95 duration-700 fill-mode-both delay-150"
                        style={{ color: "var(--text-heading)" }}>
                        Forge Your <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, var(--green), #0a9f46)" }}>Discipline</span>
                    </h1>
                    <p className="relative text-xl mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-300"
                        style={{ color: "var(--text-secondary)" }}>
                        A premium habit tracking and task management platform designed to help you build momentum, enforce strict behavioral rules, and conquer your goals.
                    </p>
                    <div className="relative flex flex-col sm:flex-row gap-4 items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-500">
                        <Link
                            to="/register"
                            className="group flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all w-full sm:w-auto justify-center"
                            style={{ background: "var(--green)", color: "var(--save-btn-text)", boxShadow: "0 0 30px -5px var(--green-glow)" }}
                        >
                            Start Forging <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg transition-all w-full sm:w-auto justify-center backdrop-blur-sm"
                            style={{ background: "var(--surface-2)", color: "var(--text-heading)", border: "1px solid var(--divider)" }}
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-24 relative z-10 shrink-0 overflow-hidden"
                    style={{ background: "var(--surface-2)", borderTop: "1px solid var(--divider)", borderBottom: "1px solid var(--divider)" }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-700">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
                                style={{ color: "var(--text-heading)" }}>
                                Systems Built for <span style={{ color: "var(--green)" }}>Consistency</span>
                            </h2>
                            <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                                Stop relying on motivation. HabitForge provides the tools to build a robust system of habits that run on autopilot.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-2xl backdrop-blur-sm transition-all group animate-in fade-in zoom-in-95 duration-700 fill-mode-both delay-[800ms]"
                                style={{ background: "var(--surface)", border: "1px solid var(--divider)" }}>
                                <div className="p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-all duration-300"
                                    style={{ background: "var(--green-dim)" }}>
                                    <Zap className="h-8 w-8" style={{ color: "var(--green)" }} />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text-heading)" }}>The Rule Engine</h3>
                                <p style={{ color: "var(--text-secondary)" }} className="leading-relaxed">
                                    Configure strict behavioral modes and enforce them. Setup daily, weekly, or custom schedules that adapt to your evolving lifestyle.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-2xl backdrop-blur-sm transition-all group animate-in fade-in zoom-in-95 duration-700 fill-mode-both delay-[900ms]"
                                style={{ background: "var(--surface)", border: "1px solid var(--divider)" }}>
                                <div className="p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-all duration-300"
                                    style={{ background: "var(--green-dim)" }}>
                                    <Users className="h-8 w-8" style={{ color: "var(--green)" }} />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text-heading)" }}>Social Clubs</h3>
                                <p style={{ color: "var(--text-secondary)" }} className="leading-relaxed">
                                    Join forces with friends. Create competitive groups, track shared habits, and stay accountable with real-time leaderboards.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-2xl backdrop-blur-sm transition-all group animate-in fade-in zoom-in-95 duration-700 fill-mode-both delay-[1000ms]"
                                style={{ background: "var(--surface)", border: "1px solid var(--divider)" }}>
                                <div className="p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-all duration-300"
                                    style={{ background: "var(--green-dim)" }}>
                                    <BarChart3 className="h-8 w-8" style={{ color: "var(--green)" }} />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text-heading)" }}>Deep Analytics</h3>
                                <p style={{ color: "var(--text-secondary)" }} className="leading-relaxed">
                                    Visualize your momentum over time. Analyze historical data, completion rates, and identify your strongest streaks through visual metrics.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="w-full py-24 px-4 sm:px-6 lg:px-8 text-center relative z-10 shrink-0">
                    <div className="max-w-3xl mx-auto rounded-3xl p-12 backdrop-blur-md animate-in fade-in zoom-in duration-1000 fill-mode-both delay-[1100ms]"
                        style={{ background: "var(--surface)", border: "1px solid var(--divider)" }}>
                        <div className="animate-bounce">
                            <Target className="h-12 w-12 mx-auto mb-6" style={{ color: "var(--green)" }} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-heading)" }}>Ready to level up your life?</h2>
                        <p className="mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                            Join HabitForge today and start building the discipline needed to achieve your goals. It takes less than a minute.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90 w-full sm:w-auto"
                            style={{ background: "var(--green)", color: "var(--save-btn-text)", boxShadow: "0 0 20px -5px var(--green-glow)" }}
                        >
                            Create Your Free Account
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="w-full pt-16 pb-8 shrink-0"
                style={{ borderTop: "1px solid var(--divider)", background: "var(--surface)" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            {/* Footer Logo */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--green)", color: "var(--save-btn-text)" }}>
                                    <Zap className="h-4 w-4" fill="currentColor" />
                                </div>
                                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "12px", color: "var(--text-primary)", letterSpacing: "0.02em", marginTop: "2px" }}>
                                    HabitForge
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                                Forging discipline and building momentum through powerful systems and community accountability.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://github.com/Sujayz22/HabitForge" target="_blank" rel="noreferrer"
                                    className="transition-opacity hover:opacity-70" style={{ color: "var(--text-secondary)" }}>
                                    <Github className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-semibold mb-6" style={{ color: "var(--text-heading)" }}>Product</h4>
                            <ul className="space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Features</Link></li>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Modes</Link></li>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Social Clubs</Link></li>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Pricing</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-semibold mb-6" style={{ color: "var(--text-heading)" }}>Resources</h4>
                            <ul className="space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Documentation</Link></li>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Blog</Link></li>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Community</Link></li>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Help Center</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-semibold mb-6" style={{ color: "var(--text-heading)" }}>Legal</h4>
                            <ul className="space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Privacy Policy</Link></li>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Terms of Service</Link></li>
                                <li><Link to="/coming-soon" className="transition-opacity hover:opacity-70">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4"
                        style={{ borderTop: "1px solid var(--divider)", paddingTop: "2rem" }}>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            &copy; {new Date().getFullYear()} HabitForge. All rights reserved.
                        </p>
                        <div className="text-sm flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                            Designed with <Heart className="h-4 w-4 mx-1 inline" style={{ color: "var(--green)" }} /> by Team Phoenix.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
