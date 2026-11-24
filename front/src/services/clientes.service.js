import { call } from "./api.service.js"

export function useApiClientes() {
    return {
        getClientes: () => call("/clientes"),
        getCliente: (id) => call(`/clientes/${id}`),
        getBarriosDeCliente: (id) => call(`/clientes/${id}/barrios`),
        crearCliente: (body) => call("/clientes", "POST", body),
        reemplazarCliente: (id, body) => call(`/clientes/${id}`, "PUT", body),
        actualizarCliente: (id, body) => call(`/clientes/${id}`, "PATCH", body),
        borrarCliente: (id) => call(`/clientes/${id}`, "DELETE"),
        asociarBarrio: (clienteId, barrioId) => call(`/clientes/${clienteId}/barrios/${barrioId}`, "PUT"),
        desasociarBarrio: (clienteId, barrioId) => call(`/clientes/${clienteId}/barrios/${barrioId}`, "DELETE")
    }
}
