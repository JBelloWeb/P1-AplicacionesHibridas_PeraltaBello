import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { registroSchema } from "../../schemas/usuarios.js"
import { useApiUsuarios } from "../../services/usuarios.service.js"
import Campo from "../../components/Campo.jsx"

export default function Registro() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: zodResolver(registroSchema) })

    const api = useApiUsuarios()
    const navigate = useNavigate()

    async function onSubmit(datos) {
        try {
            await api.registro(datos)
            toast.success("¡Cuenta creada! Ya podés ingresar.")
            navigate("/login")
        } catch (err) {
            if (err.mensajes?.length) {
                err.mensajes.forEach(({ campo, mensaje }) =>
                    toast.error(`${campo}: ${mensaje}`)
                )
            } else {
                toast.error(err.message ?? "No se pudo registrar la cuenta")
            }
        }
    }

    return (
        <div className="mx-auto max-w-md">
            <h1 className="mb-8 text-center text-3xl font-bold text-violeta-oscuro">Registrarse</h1>
            <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 rounded-3xl border border-lila/30 bg-white p-8"
            >
                <Campo
                    label="Nombre"
                    registro={register("nombre")}
                    error={errors.nombre?.message}
                    type="text"
                    placeholder="Tu nombre"
                    autoComplete="name"
                />
                <Campo
                    label="Email"
                    registro={register("email")}
                    error={errors.email?.message}
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                />
                <Campo
                    label="Contraseña"
                    registro={register("password")}
                    error={errors.password?.message}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                />
                <Campo
                    label="Confirmar contraseña"
                    registro={register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                />
                <p className="text-xs text-tinta/50">
                    La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                </p>
                <button type="submit" disabled={isSubmitting} className="btn mt-2 disabled:opacity-50">
                    {isSubmitting ? "Registrando…" : "Registrarse"}
                </button>
                <p className="text-center text-sm text-tinta/60">
                    ¿Ya tenés cuenta?{" "}
                    <Link to="/login" className="font-semibold text-violeta-oscuro hover:text-violeta">
                        Ingresá
                    </Link>
                </p>
            </form>
        </div>
    )
}
