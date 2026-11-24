import { Link, useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiClientes } from "../../services/clientes.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import Estado from "../../components/Estado.jsx"

export default function BorrarCliente() {
    const { id } = useParams()
    const navigate = useNavigate()
    const api = useApiClientes()

    const { data: cliente, estado, error } = useFetch(() => api.getCliente(id), [id])

    async function confirmar() {
        try {
            await api.borrarCliente(id)
            toast.success(`"${cliente.nombre}" fue eliminado.`)
            navigate("/clientes")
        } catch (err) {
            toast.error(err.message ?? "No se pudo eliminar el cliente")
        }
    }

    return (
        <Estado estado={estado} error={error}>
            {cliente && (
                <div className="mx-auto max-w-md">
                    <div className="flex flex-col gap-5 rounded-3xl border border-lila/30 bg-white p-8 text-center">
                        <p className="text-5xl">🗑️</p>
                        <h1 className="text-2xl font-bold text-violeta-oscuro">¿Eliminar cliente?</h1>
                        <p className="text-tinta/70">
                            El cliente <strong>{cliente.nombre}</strong> va a ser eliminado de forma
                            permanente. Sus barrios asociados quedarán libres.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                            <Link to={`/clientes/${id}`} className="btn-sec">
                                Cancelar
                            </Link>
                            <button onClick={confirmar} className="btn-peligro">
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Estado>
    )
}
