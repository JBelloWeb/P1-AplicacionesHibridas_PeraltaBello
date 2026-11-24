import { Link, useParams } from "react-router"
import { useApiBarrios } from "../../services/barrios.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import { useEsAdmin } from "../../context/session.context.jsx"
import Estado from "../../components/Estado.jsx"
import StatBox from "../../components/StatBox.jsx"
import Pastilla from "../../components/Pastilla.jsx"

export default function DetalleBarrio() {
    const { id } = useParams()
    const esAdmin = useEsAdmin()
    const api = useApiBarrios()

    const { data: barrio, estado, error } = useFetch(() => api.getBarrio(id), [id])

    return (
        <Estado estado={estado} error={error}>
            {barrio && (
                <div className="mx-auto flex max-w-3xl flex-col gap-6">
                    <div className="overflow-hidden rounded-3xl border border-lila/30 bg-white">
                        {barrio.img && (
                            <div className="relative h-56">
                                <img
                                    src={barrio.img}
                                    alt={barrio.nombre}
                                    className="h-full w-full object-cover"
                                />
                                <span className="absolute right-3 top-3 rounded-full bg-violeta-oscuro/80 px-3 py-0.5 text-sm font-semibold text-white">
                                    Comuna {barrio.comuna}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                            <div>
                                <h1 className="text-3xl font-bold text-violeta-oscuro">
                                    {barrio.nombre}
                                </h1>
                                {!barrio.img && (
                                    <p className="text-sm text-violeta/70">
                                        Comuna {barrio.comuna}
                                    </p>
                                )}
                            </div>
                            {esAdmin && (
                                <div className="flex gap-2">
                                    <Link to={`/barrios/${id}/editar`} className="btn-sec text-sm">
                                        Editar
                                    </Link>
                                    <Link to={`/barrios/${id}/borrar`} className="btn-peligro text-sm">
                                        Borrar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {(barrio.cantidad_habitantes || barrio.superficie_km2 || barrio.antiguedad_anio) && (
                        <div className="grid grid-cols-3 gap-3">
                            <StatBox
                                label="Habitantes"
                                valor={barrio.cantidad_habitantes?.toLocaleString("es-AR")}
                            />
                            <StatBox
                                label="Superficie"
                                valor={barrio.superficie_km2 ? `${barrio.superficie_km2} km²` : undefined}
                            />
                            <StatBox label="Fundado en" valor={barrio.antiguedad_anio} />
                        </div>
                    )}

                    {barrio.edificios_emblematicos?.length > 0 && (
                        <div className="rounded-2xl border border-lila/30 bg-white p-5">
                            <h2 className="mb-3 font-semibold text-violeta-oscuro">
                                Edificios emblemáticos
                            </h2>
                            <ul className="list-inside list-disc space-y-1 text-sm text-tinta/80">
                                {barrio.edificios_emblematicos.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(barrio.transporte_publico?.subtes?.length > 0 ||
                        barrio.transporte_publico?.trenes?.length > 0 ||
                        barrio.transporte_publico?.colectivos_principales?.length > 0) && (
                        <div className="rounded-2xl border border-lila/30 bg-white p-5">
                            <h2 className="mb-4 font-semibold text-violeta-oscuro">
                                Transporte público
                            </h2>
                            <div className="flex flex-col gap-4">
                                {barrio.transporte_publico.subtes?.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-xs uppercase tracking-wide text-violeta/60">
                                            Subtes
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {barrio.transporte_publico.subtes.map((s) => (
                                                <Pastilla key={s} texto={s} tipo="subte" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {barrio.transporte_publico.trenes?.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-xs uppercase tracking-wide text-violeta/60">
                                            Trenes
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {barrio.transporte_publico.trenes.map((t) => (
                                                <Pastilla key={t} texto={t} tipo="tren" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {barrio.transporte_publico.colectivos_principales?.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-xs uppercase tracking-wide text-violeta/60">
                                            Colectivos
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {barrio.transporte_publico.colectivos_principales.map(
                                                (c) => (
                                                    <Pastilla key={c} texto={c} tipo="colectivo" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {barrio.cliente && (
                        <div className="rounded-2xl border border-lila/30 bg-white p-5">
                            <h2 className="mb-3 font-semibold text-violeta-oscuro">
                                Cliente asociado
                            </h2>
                            <Link
                                to={`/clientes/${barrio.cliente._id}`}
                                className="flex items-center gap-3 text-violeta-oscuro hover:text-violeta"
                            >
                                {barrio.cliente.foto && (
                                    <img
                                        src={barrio.cliente.foto}
                                        alt=""
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                )}
                                <span className="font-semibold">{barrio.cliente.nombre}</span>
                            </Link>
                        </div>
                    )}

                    <Link to="/barrios" className="btn-sec self-start">
                        ← Volver a barrios
                    </Link>
                </div>
            )}
        </Estado>
    )
}
