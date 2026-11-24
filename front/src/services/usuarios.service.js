import { call } from "./api.service.js"

export function useApiUsuarios() {
    return {
        getUsuarios: () => call("/usuarios"),
        registro: (body) => call("/auth/registro", "POST", body),
        login: (body) => call("/auth/login", "POST", body)
    }
}
