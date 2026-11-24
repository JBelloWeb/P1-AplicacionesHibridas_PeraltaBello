import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { useApiClientes } from "../../services/clientes.service.js"
import ClienteForm from "./ClienteForm.jsx"

export default function NuevoCliente() {
    const api = useApiClientes()
    const navigate = useNavigate()

    async function onSubmit(datos) {
        const cliente = await api.crearCliente(datos)
        toast.success("Cliente creado.")
        navigate(`/clientes/${cliente._id}`)
    }

    return <ClienteForm titulo="Nuevo cliente" onSubmit={onSubmit} cancelar="/clientes" />
}
