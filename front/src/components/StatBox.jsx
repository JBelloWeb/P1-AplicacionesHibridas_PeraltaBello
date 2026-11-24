export default function StatBox({ label, valor }) {
    if (valor === undefined || valor === null) return null
    return (
        <div className="rounded-2xl border border-lila/30 bg-white px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-violeta/70">{label}</p>
            <p className="mt-1 text-lg font-bold text-violeta-oscuro">{valor}</p>
        </div>
    )
}
