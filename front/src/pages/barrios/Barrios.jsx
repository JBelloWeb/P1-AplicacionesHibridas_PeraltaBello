import { Link, useSearchParams } from "react-router"
import { useApiBarrios } from "../../services/barrios.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import { useEsAdmin } from "../../context/session.context.jsx"
import BarrioCard from "../../components/BarrioCard.jsx"
import Estado from "../../components/Estado.jsx"

export default function Barrios() {
    const [searchParams, setSearchParams] = useSearchParams()
    const q = searchParams.get("q") ?? ""
    const comuna = searchParams.get("comuna") ?? ""
    const linea = searchParams.get("linea") ?? ""
    const orden = searchParams.get("orden") ?? ""

    const esAdmin = useEsAdmin()
    const api = useApiBarrios()

    const { data: barrios, estado, error } = useFetch(
        () => api.getBarrios({ q, comuna, linea, orden }),
        [q, comuna, linea, orden]
    )
    const { data: lineasData } = useFetch(() => api.getLineas(), [])

    function setParam(key, value) {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev)
                if (value) next.set(key, value)
                else next.delete(key)
                return next
            },
            { replace: true }
        )
    }

    const todasLineas = [
        ...(lineasData?.subtes ?? []),
        ...(lineasData?.trenes ?? []),
        ...(lineasData?.colectivos ?? [])
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-violeta-oscuro">Barrios</h1>
                {esAdmin && (
                    <div className="flex gap-2">
                        <Link to="/barrios/desactivados" className="btn-sec text-sm">
                            Desactivados
                        </Link>
                        <Link to="/barrios/nuevo" className="btn text-sm">
                            + Nuevo barrio
                        </Link>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-3 rounded-2xl border border-lila/30 bg-white p-4">
                <input
                    type="search"
                    value={q}
                    onChange={(e) => setParam("q", e.target.value)}
                    placeholder="Buscar barrio…"
                    className="campo min-w-48 flex-1"
                />
                <select
                    value={comuna}
                    onChange={(e) => setParam("comuna", e.target.value)}
                    className="campo w-auto"
                >
                    <option value="">Todas las comunas</option>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                            Comuna {n}
                        </option>
                    ))}
                </select>
                {todasLineas.length > 0 && (
                    <select
                        value={linea}
                        onChange={(e) => setParam("linea", e.target.value)}
                        className="campo w-auto"
                    >
                        <option value="">Todas las líneas</option>
                        {todasLineas.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                )}
                <select
                    value={orden}
                    onChange={(e) => setParam("orden", e.target.value)}
                    className="campo w-auto"
                >
                    <option value="">Ordenar por nombre</option>
                    <option value="antiguedad">Antigüedad</option>
                    <option value="habitantes">Habitantes</option>
                    <option value="superficie">Superficie</option>
                </select>
            </div>

            <Estado
                estado={estado}
                error={error}
                vacio={estado === "ok" && !barrios?.length && "Todavía no hay barrios con ese filtro."}
            >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {barrios?.map((barrio) => (
                        <BarrioCard key={barrio._id} barrio={barrio} />
                    ))}
                </div>
            </Estado>
        </div>
    )
}
