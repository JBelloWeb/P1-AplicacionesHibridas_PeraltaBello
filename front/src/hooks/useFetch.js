import { useState, useEffect, useCallback } from "react"

export function useFetch(fn, deps = []) {
    const [data, setData] = useState(null)
    const [estado, setEstado] = useState("cargando")
    const [error, setError] = useState(null)

    const recargar = useCallback(() => {
        setEstado("cargando")
        setError(null)
        fn()
            .then((datos) => {
                setData(datos)
                setEstado("ok")
            })
            .catch((err) => {
                setError(err.message)
                setEstado("error")
            })
    }, deps)

    useEffect(() => {
        recargar()
    }, [recargar])

    return { data, estado, error, recargar }
}
