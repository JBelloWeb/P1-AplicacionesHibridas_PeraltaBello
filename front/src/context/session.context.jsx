import { createContext, useContext, useState } from "react"
import { jwtDecode } from "jwt-decode"

const SessionContext = createContext(null)

function obtenerSesionInicial() {
    const token = sessionStorage.getItem("token")
    if (!token) return null
    try {
        const { exp } = jwtDecode(token)
        if (Date.now() / 1000 > exp) {
            sessionStorage.clear()
            return null
        }
        return JSON.parse(sessionStorage.getItem("usuario"))
    } catch {
        return null
    }
}

export function SessionProvider({ children }) {
    const [usuario, setUsuario] = useState(obtenerSesionInicial)

    function login(datos) {
        const { token, ...perfil } = datos
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("usuario", JSON.stringify(perfil))
        setUsuario(perfil)
    }

    function logout() {
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("usuario")
        setUsuario(null)
    }

    return (
        <SessionContext.Provider value={{ usuario, login, logout }}>
            {children}
        </SessionContext.Provider>
    )
}

export const useUsuario = () => useContext(SessionContext).usuario
export const useLogin = () => useContext(SessionContext).login
export const useLogout = () => useContext(SessionContext).logout
export const useEsAdmin = () => useContext(SessionContext).usuario?.rol === "admin"
