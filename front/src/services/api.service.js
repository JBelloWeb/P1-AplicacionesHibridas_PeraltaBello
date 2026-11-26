const BASE = import.meta.env.VITE_API_URL

export async function call(uri, method = "GET", body) {
    const token = sessionStorage.getItem("token")
    const headers = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const opciones = { method, headers }
    if (body !== undefined && method !== "GET") opciones.body = JSON.stringify(body)

    const res = await fetch(`${BASE}${uri}`, opciones)

    // 401 con token en una ruta protegida = sesión vencida o inválida.
    // En /auth/* (login con credenciales incorrectas) el error sigue el camino
    // normal para que el form muestre el mensaje del back.
    if (res.status === 401 && token && !uri.startsWith("/auth/")) {
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("usuario")
        window.location.href = "/login"
        throw new Error("Sesión vencida")
    }

    const datos = await res.json().catch(() => null)

    if (!res.ok) {
        const err = new Error(datos?.message ?? "Error del servidor")
        err.status = res.status
        err.mensajes = datos?.errores ?? []
        throw err
    }

    return datos
}
