import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router"
import { toast } from "react-toastify"
import { barrioSchema } from "../../schemas/barrios.js"
import Campo from "../../components/Campo.jsx"

// Convierte un barrio de la API (arrays) a valores usables por los inputs (strings).
export function barrioAFormValues(barrio = {}) {
    const toStr = (arr) => (arr ?? []).join(", ")
    return {
        nombre: barrio.nombre ?? "",
        comuna: barrio.comuna ?? "",
        img: barrio.img ?? "",
        cantidad_habitantes: barrio.cantidad_habitantes ?? "",
        superficie_km2: barrio.superficie_km2 ?? "",
        antiguedad_anio: barrio.antiguedad_anio ?? "",
        edificios_emblematicos: toStr(barrio.edificios_emblematicos),
        transporte_publico: {
            subtes: toStr(barrio.transporte_publico?.subtes),
            trenes: toStr(barrio.transporte_publico?.trenes),
            colectivos_principales: toStr(barrio.transporte_publico?.colectivos_principales)
        }
    }
}

export default function BarrioForm({ titulo, valoresIniciales = {}, onSubmit, cancelar }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(barrioSchema),
        defaultValues: barrioAFormValues(valoresIniciales)
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
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-8 text-3xl font-bold text-violeta-oscuro">{titulo}</h1>
            <form
                noValidate
                onSubmit={handleSubmit(handleEnvio)}
                className="flex flex-col gap-5 rounded-3xl border border-lila/30 bg-white p-8"
            >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Campo
                            label="Nombre *"
                            registro={register("nombre")}
                            error={errors.nombre?.message}
                            placeholder="Palermo"
                        />
                    </div>
                    <Campo
                        label="Comuna (1–15) *"
                        registro={register("comuna")}
                        error={errors.comuna?.message}
                        type="number"
                        min="1"
                        max="15"
                    />
                    <Campo
                        label="Fundado en (año)"
                        registro={register("antiguedad_anio")}
                        error={errors.antiguedad_anio?.message}
                        type="number"
                        placeholder="1850"
                        min="1536"
                    />
                    <Campo
                        label="Habitantes"
                        registro={register("cantidad_habitantes")}
                        error={errors.cantidad_habitantes?.message}
                        type="number"
                        min="0"
                    />
                    <Campo
                        label="Superficie (km²)"
                        registro={register("superficie_km2")}
                        error={errors.superficie_km2?.message}
                        type="number"
                        step="0.01"
                        min="0.01"
                    />
                    <div className="sm:col-span-2">
                        <Campo
                            label="Imagen (URL)"
                            registro={register("img")}
                            error={errors.img?.message}
                            placeholder="https://…"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Campo
                            label="Edificios emblemáticos (separados por coma)"
                            registro={register("edificios_emblematicos")}
                            error={errors.edificios_emblematicos?.message}
                            placeholder="Teatro Colón, Obelisco"
                        />
                    </div>
                </div>

                <fieldset className="rounded-2xl border border-lila/30 p-5 flex flex-col gap-4">
                    <legend className="px-2 text-sm font-semibold text-violeta-oscuro">
                        Transporte público
                    </legend>
                    <Campo
                        label="Subtes (separados por coma)"
                        registro={register("transporte_publico.subtes")}
                        error={errors.transporte_publico?.subtes?.message}
                        placeholder="Línea A, Línea D"
                    />
                    <Campo
                        label="Trenes (separados por coma)"
                        registro={register("transporte_publico.trenes")}
                        error={errors.transporte_publico?.trenes?.message}
                        placeholder="Mitre, Roca"
                    />
                    <Campo
                        label="Colectivos principales (separados por coma)"
                        registro={register("transporte_publico.colectivos_principales")}
                        error={errors.transporte_publico?.colectivos_principales?.message}
                        placeholder="7, 24, 130"
                    />
                </fieldset>

                <div className="flex gap-3 mt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn disabled:opacity-50"
                    >
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
