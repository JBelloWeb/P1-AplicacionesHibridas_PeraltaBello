import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiBarrios } from "../../services/barrios.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import Estado from "../../components/Estado.jsx"
import BarrioForm from "./BarrioForm.jsx"

export default function EditarBarrio() {
    const { id } = useParams()
    const api = useApiBarrios()
    const navigate = useNavigate()

    const { data: barrio, estado, error } = useFetch(() => api.getBarrio(id), [id])

    async function onSubmit(datos) {
        await api.reemplazarBarrio(id, datos)
        toast.success("Barrio actualizado.")
        navigate(`/barrios/${id}`)
    }

    return (
        <Estado estado={estado} error={error}>
            {barrio && (
                <BarrioForm
                    titulo={`Editar: ${barrio.nombre}`}
                    valoresIniciales={barrio}
                    onSubmit={onSubmit}
                    cancelar={`/barrios/${id}`}
                />
            )}
        </Estado>
    )
}
