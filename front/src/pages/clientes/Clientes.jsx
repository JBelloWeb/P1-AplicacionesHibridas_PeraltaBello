import { Link } from "react-router"
import { useApiClientes } from "../../services/clientes.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import { useEsAdmin } from "../../context/session.context.jsx"
import ClienteCard from "../../components/ClienteCard.jsx"
import Estado from "../../components/Estado.jsx"

export default function Clientes() {
    const esAdmin = useEsAdmin()
    const api = useApiClientes()

    const { data: clientes, estado, error } = useFetch(() => api.getClientes(), [])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-violeta-oscuro">Clientes</h1>
                {esAdmin && (
                    <Link to="/clientes/nuevo" className="btn text-sm">
                        + Nuevo cliente
                    </Link>
                )}
            </div>
            <Estado
                estado={estado}
                error={error}
                vacio={estado === "ok" && !clientes?.length && "Todavía no hay clientes registrados."}
            >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {clientes?.map((cliente) => (
                        <ClienteCard key={cliente._id} cliente={cliente} />
                    ))}
                </div>
            </Estado>
        </div>
    )
}
