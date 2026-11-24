import { useApiUsuarios } from "../services/usuarios.service.js"
import { useFetch } from "../hooks/useFetch.js"
import Estado from "../components/Estado.jsx"

export default function Usuarios() {
    const api = useApiUsuarios()
    const { data: usuarios, estado, error } = useFetch(() => api.getUsuarios(), [])

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-violeta-oscuro">Usuarios</h1>
            <Estado
                estado={estado}
                error={error}
                vacio={estado === "ok" && !usuarios?.length && "No hay usuarios registrados."}
            >
                <div className="overflow-x-auto rounded-2xl border border-lila/30 bg-white">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-lila/20 text-left text-xs uppercase tracking-wide text-violeta/60">
                                <th className="px-5 py-3">Nombre</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Rol</th>
                                <th className="px-5 py-3">Creado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios?.map((u) => (
                                <tr
                                    key={u._id}
                                    className="border-b border-lila/10 last:border-0 hover:bg-papel/60"
                                >
                                    <td className="px-5 py-3 font-semibold text-violeta-oscuro">
                                        {u.nombre}
                                    </td>
                                    <td className="px-5 py-3 text-tinta/70">{u.email}</td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                                                u.rol === "admin"
                                                    ? "bg-violeta-oscuro text-white"
                                                    : "bg-durazno text-violeta-oscuro"
                                            }`}
                                        >
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-tinta/50">
                                        {u.creadoEn
                                            ? new Date(u.creadoEn).toLocaleDateString("es-AR")
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Estado>
        </div>
    )
}
