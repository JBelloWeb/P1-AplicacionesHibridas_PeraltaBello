import { Link, useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiBarrios } from "../../services/barrios.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import Estado from "../../components/Estado.jsx"

export default function BorrarBarrio() {
    const { id } = useParams()
    const navigate = useNavigate()
    const api = useApiBarrios()

    const { data: barrio, estado, error } = useFetch(() => api.getBarrio(id), [id])

    async function confirmar() {
        try {
            await api.borrarBarrio(id)
            toast.success(`"${barrio.nombre}" fue desactivado.`)
            navigate("/barrios")
        } catch (err) {
            toast.error(err.message ?? "No se pudo desactivar el barrio")
        }
    }

    return (
        <Estado estado={estado} error={error}>
            {barrio && (
                <div className="mx-auto max-w-md">
                    <div className="flex flex-col gap-5 rounded-3xl border border-lila/30 bg-white p-8 text-center">
                        <p className="text-5xl">🗑️</p>
                        <h1 className="text-2xl font-bold text-violeta-oscuro">¿Desactivar barrio?</h1>
                        <p className="text-tinta/70">
                            El barrio <strong>{barrio.nombre}</strong> va a quedar desactivado. Podés
                            reactivarlo desde el panel de administración.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                            <Link to={`/barrios/${id}`} className="btn-sec">
                                Cancelar
                            </Link>
                            <button onClick={confirmar} className="btn-peligro">
                                Sí, desactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Estado>
    )
}
