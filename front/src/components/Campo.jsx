export default function Campo({ label, registro, error, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-violeta-oscuro">{label}</label>
            <input className={`campo ${error ? "border-red-400 focus:outline-red-400" : ""}`} {...registro} {...props} />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}
