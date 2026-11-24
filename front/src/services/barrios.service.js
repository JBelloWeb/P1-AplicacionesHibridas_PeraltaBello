import { call } from "./api.service.js"

export function useApiBarrios() {
    return {
        getBarrios: (filtros = {}) => {
            const params = new URLSearchParams(
                Object.fromEntries(Object.entries(filtros).filter(([, v]) => v !== undefined && v !== ""))
            ).toString()
            return call(`/barrios${params ? `?${params}` : ""}`)
        },
        getBarrio: (id) => call(`/barrios/${id}`),
        getLineas: () => call("/barrios/lineas"),
        getDesactivados: () => call("/barrios?eliminado=true"),
        crearBarrio: (body) => call("/barrios", "POST", body),
        reemplazarBarrio: (id, body) => call(`/barrios/${id}`, "PUT", body),
        actualizarBarrio: (id, body) => call(`/barrios/${id}`, "PATCH", body),
        borrarBarrio: (id) => call(`/barrios/${id}`, "DELETE"),
        activarBarrio: (id) => call(`/barrios/${id}/activar`, "PATCH")
    }
}
