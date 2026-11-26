import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiClientes } from "../../services/clientes.service.js"
import { useApiBarrios } from "../../services/barrios.service.js"
import { useFetch } from "../../hooks/useFetch.js"
import { useEsAdmin } from "../../context/session.context.jsx"
import Estado from "../../components/Estado.jsx"

export default function DetalleCliente() {
    const { id } = useParams()
    const esAdmin = useEsAdmin()
    const apiClientes = useApiClientes()
    const apiBarrios = useApiBarrios()

    const { data: cliente, estado, error } = useFetch(() => apiClientes.getCliente(id), [id])

    const [barriosAsociados, setBarriosAsociados] = useState(null)
    const [cargandoBarrios, setCargandoBarrios] = useState(true)

    const [todosBarrios, setTodosBarrios] = useState([])

    const [seleccionado, setSeleccionado] = useState("")

    useEffect(() => {
        setCargandoBarrios(true)
        apiClientes
            .getBarriosDeCliente(id)
            .then((data) => {
                setBarriosAsociados(data)
                setCargandoBarrios(false)
            })
            .catch(() => setCargandoBarrios(false))

        if (esAdmin) {
            apiBarrios.getBarrios().then(setTodosBarrios)
        }
    }, [id])

    const disponibles = todosBarrios.filter((b) => !b.clienteId)

    async function asociar() {
        if (!seleccionado) return
        try {
            const barrio = await apiClientes.asociarBarrio(id, seleccionado)
            setBarriosAsociados((prev) => [...(prev ?? []), barrio])
            setTodosBarrios((prev) =>
                prev.map((b) => (b._id === seleccionado ? { ...b, clienteId: id } : b))
            )
            setSeleccionado("")
            toast.success("Barrio asociado.")
        } catch (err) {
            toast.error(err.message ?? "No se pudo asociar el barrio")
        }
    }

    async function desasociar(barrioId) {
        try {
            await apiClientes.desasociarBarrio(id, barrioId)
            setBarriosAsociados((prev) => prev?.filter((b) => b._id !== barrioId))
            setTodosBarrios((prev) =>
                prev.map((b) => (b._id === barrioId ? { ...b, clienteId: undefined } : b))
            )
            toast.success("Barrio quitado.")
        } catch (err) {
            toast.error(err.message ?? "No se pudo quitar el barrio")
        }
    }

    return (
        <Estado estado={estado} error={error}>
            {cliente && (
                <div className="mx-auto flex max-w-3xl flex-col gap-6">
                    <div className="overflow-hidden rounded-3xl border border-lila/30 bg-white">
                        {cliente.foto && (
                            <div className="h-48">
                                <img
                                    src={cliente.foto}
                                    alt={cliente.nombre}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                            <div>
                                <h1 className="text-3xl font-bold text-violeta-oscuro">
                                    {cliente.nombre}
                                </h1>
                                {cliente.descripcion && (
                                    <p className="mt-1 text-tinta/70">{cliente.descripcion}</p>
                                )}
                            </div>
                            {esAdmin && (
                                <div className="flex gap-2">
                                    <Link to={`/clientes/${id}/editar`} className="btn-sec text-sm">
                                        Editar
                                    </Link>
                                    <Link to={`/clientes/${id}/borrar`} className="btn-peligro text-sm">
                                        Borrar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-lila/30 bg-white p-5">
                        <h2 className="mb-4 font-semibold text-violeta-oscuro">Barrios asociados</h2>

                        {cargandoBarrios ? (
                            <p className="text-sm text-violeta animate-pulse">Cargando…</p>
                        ) : barriosAsociados?.length === 0 ? (
                            <p className="text-sm text-tinta/60">
                                Este cliente todavía no tiene barrios asociados.
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {barriosAsociados?.map((barrio) => (
                                    <li
                                        key={barrio._id}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-lila/20 px-4 py-2"
                                    >
                                        <Link
                                            to={`/barrios/${barrio._id}`}
                                            className="font-semibold text-violeta-oscuro hover:text-violeta"
                                        >
                                            {barrio.nombre}
                                            <span className="ml-2 text-xs font-normal text-tinta/50">
                                                C{barrio.comuna}
                                            </span>
                                        </Link>
                                        {esAdmin && (
                                            <button
                                                onClick={() => desasociar(barrio._id)}
                                                className="text-xs font-semibold text-red-500 hover:text-red-700"
                                            >
                                                Quitar
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {esAdmin && disponibles.length > 0 && (
                            <div className="mt-5 flex gap-2 border-t border-lila/20 pt-4">
                                <select
                                    value={seleccionado}
                                    onChange={(e) => setSeleccionado(e.target.value)}
                                    className="campo flex-1"
                                >
                                    <option value="">Seleccioná un barrio para asociar…</option>
                                    {disponibles.map((b) => (
                                        <option key={b._id} value={b._id}>
                                            {b.nombre} (C{b.comuna})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={asociar}
                                    disabled={!seleccionado}
                                    className="btn text-sm disabled:opacity-40"
                                >
                                    Asociar
                                </button>
                            </div>
                        )}
                    </div>

                    <Link to="/clientes" className="btn-sec self-start">
                        ← Volver a clientes
                    </Link>
                </div>
            )}
        </Estado>
    )
}
