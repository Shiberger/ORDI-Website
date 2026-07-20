import { formatTHB, type DailyRevenue } from '@ordi/shared'

type Props = {
  daily: DailyRevenue[]
  days: number
}

/**
 * Plain CSS bars — no charting library. The series is a fixed 30-ish points
 * with one measure, which does not justify shipping a dependency.
 */
export function RevenueChart({ daily, days }: Props) {
  const peak = Math.max(...daily.map((d) => d.revenue), 1)
  const total = daily.reduce((sum, d) => sum + d.revenue, 0)

  return (
    <section className="chart">
      <p className="eyebrow">Revenue · last {days} days</p>
      <strong style={{ fontSize: 24, fontWeight: 500 }}>{formatTHB(total)}</strong>

      <div className="chart__bars">
        {daily.map((d) => (
          <div
            key={d.date}
            className="chart__bar"
            data-empty={d.revenue === 0}
            style={{ height: `${Math.max((d.revenue / peak) * 100, 1)}%` }}
            title={`${d.date} — ${formatTHB(d.revenue)} · ${d.orders} order${d.orders === 1 ? '' : 's'}`}
          />
        ))}
      </div>

      <div className="chart__axis">
        <span>{daily[0]?.date}</span>
        <span>peak {formatTHB(peak)}</span>
        <span>{daily[daily.length - 1]?.date}</span>
      </div>
    </section>
  )
}
