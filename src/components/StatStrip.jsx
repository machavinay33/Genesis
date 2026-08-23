export default function StatStrip({ stats }) {
  return (
    <div className="grid grid-cols-2 divide-y divide-line border hairline sm:grid-cols-4 sm:divide-x sm:divide-y-0">
      {stats.map((s) => (
        <div key={s.label} className="scan-panel px-5 py-5">
          <p className="stat-tick text-3xl text-genesis md:text-4xl">{s.value}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-steel">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
