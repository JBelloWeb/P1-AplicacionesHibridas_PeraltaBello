import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router"
import { toast } from "react-toastify"
import { clienteSchema } from "../../schemas/clientes.js"
import Campo from "../../components/Campo.jsx"

export function clienteAFormValues(cliente = {}) {
    return {
        nombre: cliente.nombre ?? "",
        foto: cliente.foto ?? "",
        descripcion: cliente.descripcion ?? ""
    }
}

export default function ClienteForm({ titulo, valoresIniciales = {}, onSubmit, cancelar }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(clienteSchema),
        defaultValues: clienteAFormValues(valoresIniciales)
    })

    async function handleEnvio(datos) {
        try {
            await onSubmit(datos)
        } catch (err) {
            if (err.mensajes?.length) {
                err.mensajes.forEach(({ campo, mensaje }) => toast.error(`${campo}: ${mensaje}`))
            } else {
                toast.error(err.message ?? "Error al guardar")
            }
        }
    }

    return (
        <div className="mx-auto max-w-xl">
            <h1 className="mb-8 text-3xl font-bold text-violeta-oscuro">{titulo}</h1>
            <form
                noValidate
                onSubmit={handleSubmit(handleEnvio)}
                className="flex flex-col gap-5 rounded-3xl border border-lila/30 bg-white p-8"
            >
                <Campo
                    label="Nombre *"
                    registro={register("nombre")}
                    error={errors.nombre?.message}
                    placeholder="Nombre del cliente"
                />
                <Campo
                    label="Foto (URL)"
                    registro={register("foto")}
                    error={errors.foto?.message}
                    placeholder="https://…"
                />
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-violeta-oscuro">Descripción</label>
                    <textarea
                        {...register("descripcion")}
                        rows={4}
                        placeholder="Breve descripción del cliente…"
                        className={`campo resize-none ${errors.descripcion ? "border-red-400" : ""}`}
                    />
                    {errors.descripcion && (
                        <span className="text-xs text-red-500">{errors.descripcion.message}</span>
                    )}
                </div>
                <div className="flex gap-3 mt-2">
                    <button type="submit" disabled={isSubmitting} className="btn disabled:opacity-50">
                        {isSubmitting ? "Guardando…" : "Guardar"}
                    </button>
                    <Link to={cancelar} className="btn-sec">
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    )
}
