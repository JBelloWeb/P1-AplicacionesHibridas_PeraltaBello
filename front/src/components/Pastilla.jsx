export default function Pastilla({ texto, tipo }) {
    const colores = {
        subte: "bg-violeta/15 text-violeta-oscuro",
        tren: "bg-violeta/30 text-violeta-oscuro",
        colectivo: "bg-durazno text-violeta-oscuro",
        default: "bg-durazno text-violeta-oscuro"
    }
    return (
        <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${colores[tipo] ?? colores.default}`}>
            {texto}
        </span>
    )
}
