import { Link } from "react-router"

export default function ClienteCard({ cliente }) {
    return (
        <article className="card overflow-hidden">
            <div className="relative h-32 bg-durazno/30">
                {cliente.foto ? (
                    <img src={cliente.foto} alt={cliente.nombre} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full items-center justify-center text-violeta/30 text-4xl font-bold">
                        {cliente.nombre[0]}
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4 gap-3">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-violeta-oscuro text-lg leading-tight">{cliente.nombre}</h2>
                    {cliente.cantidad_barrios > 0 && (
                        <span className="pastilla shrink-0 text-xs">
                            {cliente.cantidad_barrios} barrio{cliente.cantidad_barrios !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                {cliente.descripcion && (
                    <p className="text-sm text-tinta/70 line-clamp-2">{cliente.descripcion}</p>
                )}
                <div className="mt-auto">
                    <Link to={`/clientes/${cliente._id}`} className="btn text-sm w-full text-center block">
                        Ver detalle
                    </Link>
                </div>
            </div>
        </article>
    )
}
