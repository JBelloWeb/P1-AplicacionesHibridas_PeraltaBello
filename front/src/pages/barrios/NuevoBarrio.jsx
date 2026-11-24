import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { useApiBarrios } from "../../services/barrios.service.js"
import BarrioForm from "./BarrioForm.jsx"

export default function NuevoBarrio() {
    const api = useApiBarrios()
    const navigate = useNavigate()

    async function onSubmit(datos) {
        const barrio = await api.crearBarrio(datos)
        toast.success("Barrio creado.")
        navigate(`/barrios/${barrio._id}`)
    }

    return <BarrioForm titulo="Nuevo barrio" onSubmit={onSubmit} cancelar="/barrios" />
}
