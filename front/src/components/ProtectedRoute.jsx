import { Navigate } from "react-router"
import { useUsuario } from "../context/session.context.jsx"

export default function ProtectedRoute({ children, roles }) {
    const usuario = useUsuario()

    if (!usuario) return <Navigate to="/login" replace />
    if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />

    return children
}
