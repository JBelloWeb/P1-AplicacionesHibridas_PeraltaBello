import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiClientes } from "../../services/clientes.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import Estado from "../../components/Estado.jsx"
import ClienteForm, { clienteAFormValues } from "./ClienteForm.jsx"

export default function EditarCliente() {
    const { id } = useParams()
    const api = useApiClientes()
    const navigate = useNavigate()

    const { data: cliente, estado, error } = useFetch(() => api.getCliente(id), [id])

    async function onSubmit(datos) {
        await api.reemplazarCliente(id, datos)
        toast.success("Cliente actualizado.")
        navigate(`/clientes/${id}`)
    }

    return (
        <Estado estado={estado} error={error}>
            {cliente && (
                <ClienteForm
                    titulo={`Editar: ${cliente.nombre}`}
                    valoresIniciales={clienteAFormValues(cliente)}
                    onSubmit={onSubmit}
                    cancelar={`/clientes/${id}`}
                />
            )}
        </Estado>
    )
}
