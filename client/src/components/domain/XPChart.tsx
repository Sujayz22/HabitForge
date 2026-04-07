import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts"
import { useMemo } from "react"

interface XPChartProps {
    logs: any[]
    days?: number
}

export function XPChart({ logs, days = 7 }: XPChartProps) {
    const data = useMemo(() => {
        const now = new Date()
        const result = []
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().slice(0, 10)
            const dayLogs = logs.filter((l: any) => l.completedAt?.slice(0, 10) === dateStr)
            const xp = dayLogs.reduce((sum: number, l: any) => sum + (l.xpEarned || 10), 0)
            result.push({
                date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                xp,
                completions: dayLogs.length,
            })
        }
        return result
    }, [logs, days])

    const hasData = data.some(d => d.xp > 0)

    if (!hasData) {
        return (
            <div className="flex items-center justify-center h-full min-h-[160px] text-sm" style={{ color: "var(--text-muted)" }}>
                Complete habits to see your XP momentum
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={160}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#13ec6a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#13ec6a" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-3)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "var(--text-heading)" }}
                    labelStyle={{ color: "var(--text-tertiary)", fontSize: 12 }}
                    formatter={(val: any) => [`${val} XP`, "XP Earned"]}
                />
                <Area type="monotone" dataKey="xp" stroke="#13ec6a" strokeWidth={2} fill="url(#xpGradient)" dot={false} />
            </AreaChart>
        </ResponsiveContainer>
    )
}
