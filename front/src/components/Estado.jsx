export default function Estado({ estado, error, vacio, children }) {
    if (estado === "cargando") {
        return <p className="py-16 text-center text-violeta animate-pulse">Cargando…</p>
    }
    if (estado === "error") {
        return <p className="py-16 text-center text-red-500">{error ?? "Algo salió mal."}</p>
    }
    if (vacio) {
        return <p className="py-16 text-center text-violeta/60">{vacio}</p>
    }
    return children
}
