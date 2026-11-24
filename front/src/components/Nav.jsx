import { Link, NavLink, useNavigate } from "react-router"
import { useUsuario, useLogout } from "../context/session.context.jsx"

export default function Nav() {
    const usuario = useUsuario()
    const logout = useLogout()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/")
    }

    return (
        <header className="bg-violeta-oscuro text-white shadow-sm">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-durazno transition-colors mr-auto">
                    Barriopoli
                </Link>
                <div className="flex items-center gap-4 text-sm font-semibold flex-wrap">
                    <NavLink
                        to="/barrios"
                        className={({ isActive }) =>
                            isActive ? "text-durazno" : "text-white/80 hover:text-durazno transition-colors"
                        }
                    >
                        Barrios
                    </NavLink>
                    {usuario && (
                        <NavLink
                            to="/clientes"
                            className={({ isActive }) =>
                                isActive ? "text-durazno" : "text-white/80 hover:text-durazno transition-colors"
                            }
                        >
                            Clientes
                        </NavLink>
                    )}
                    {usuario?.rol === "admin" && (
                        <NavLink
                            to="/usuarios"
                            className={({ isActive }) =>
                                isActive ? "text-durazno" : "text-white/80 hover:text-durazno transition-colors"
                            }
                        >
                            Usuarios
                        </NavLink>
                    )}
                    {usuario ? (
                        <button
                            onClick={handleLogout}
                            className="rounded-full border-2 border-white/60 px-4 py-1 text-white/90 hover:bg-white/10 transition-colors"
                        >
                            Salir · {usuario.nombre}
                        </button>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-durazno"
                                        : "text-white/80 hover:text-durazno transition-colors"
                                }
                            >
                                Ingresar
                            </NavLink>
                            <NavLink
                                to="/registro"
                                className="rounded-full bg-durazno px-4 py-1 font-semibold text-violeta-oscuro hover:bg-durazno/80 transition-colors"
                            >
                                Registrarse
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}
