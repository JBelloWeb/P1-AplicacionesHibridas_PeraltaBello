import { Link } from "react-router"
import Pastilla from "./Pastilla.jsx"

export default function BarrioCard({ barrio }) {
    const colectivos = barrio.transporte_publico?.colectivos_principales ?? []
    const subtes = barrio.transporte_publico?.subtes ?? []
    const trenes = barrio.transporte_publico?.trenes ?? []

    const lineas = [
        ...subtes.map((t) => ({ texto: t, tipo: "subte" })),
        ...trenes.map((t) => ({ texto: t, tipo: "tren" })),
        ...colectivos.map((t) => ({ texto: t, tipo: "colectivo" }))
    ]
    const visibles = lineas.slice(0, 3)
    const resto = lineas.length - visibles.length

    return (
        <article className="card overflow-hidden">
            <div className="relative h-40 bg-violeta/10">
                {barrio.img ? (
                    <img src={barrio.img} alt={barrio.nombre} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full items-center justify-center text-violeta/30 text-4xl font-bold">
                        {barrio.nombre[0]}
                    </div>
                )}
                <span className="absolute top-2 right-2 rounded-full bg-violeta-oscuro/80 px-2 py-0.5 text-xs font-semibold text-white">
                    C{barrio.comuna}
                </span>
            </div>
            <div className="flex flex-1 flex-col p-4 gap-3">
                <h2 className="font-bold text-violeta-oscuro text-lg leading-tight">{barrio.nombre}</h2>
                {lineas.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {visibles.map((l, i) => <Pastilla key={i} texto={l.texto} tipo={l.tipo} />)}
                        {resto > 0 && <Pastilla texto={`+${resto}`} />}
                    </div>
                )}
                <div className="mt-auto">
                    <Link to={`/barrios/${barrio._id}`} className="btn text-sm w-full text-center block">
                        Ver detalle
                    </Link>
                </div>
            </div>
        </article>
    )
}
