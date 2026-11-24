import { Link } from "react-router"
import { toast } from "react-toastify"
import { useApiBarrios } from "../../services/barrios.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import Estado from "../../components/Estado.jsx"

export default function BarriosDesactivados() {
    const api = useApiBarrios()
    const { data: barrios, estado, error, recargar } = useFetch(() => api.getDesactivados(), [])

    async function reactivar(barrio) {
        try {
            await api.activarBarrio(barrio._id)
            toast.success(`"${barrio.nombre}" reactivado.`)
            recargar()
        } catch (err) {
            toast.error(err.message ?? "No se pudo reactivar el barrio")
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-violeta-oscuro">Barrios desactivados</h1>
                <Link to="/barrios" className="btn-sec text-sm">
                    ← Volver
                </Link>
            </div>
            <Estado
                estado={estado}
                error={error}
                vacio={estado === "ok" && !barrios?.length && "No hay barrios desactivados."}
            >
                <div className="flex flex-col gap-3">
                    {barrios?.map((barrio) => (
                        <div
                            key={barrio._id}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-lila/30 bg-white px-5 py-4"
                        >
                            <div>
                                <p className="font-semibold text-violeta-oscuro">{barrio.nombre}</p>
                                <p className="text-sm text-tinta/60">Comuna {barrio.comuna}</p>
                            </div>
                            <button
                                onClick={() => reactivar(barrio)}
                                className="btn text-sm"
                            >
                                Reactivar
                            </button>
                        </div>
                    ))}
                </div>
            </Estado>
        </div>
    )
}
